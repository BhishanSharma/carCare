import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { CartService, CartItem } from '../../services/cart';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  totalItems: number = 0;
  
  private cartSubscription!: Subscription;
  private totalSubscription!: Subscription;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private cartService: CartService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Subscribe to cart changes
    this.cartSubscription = this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });

    // Subscribe to total changes
    this.totalSubscription = this.cartService.getCartTotal().subscribe(total => {
      this.subtotal = total;
      this.calculateTotals();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.totalSubscription) {
      this.totalSubscription.unsubscribe();
    }
  }

  calculateTotals() {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.tax = this.subtotal * 0.18; // 18% GST
    this.total = this.subtotal + this.tax;
  }

  increaseQuantity(itemId: number) {
    this.cartService.increaseQuantity(itemId);
  }

  decreaseQuantity(itemId: number) {
    this.cartService.decreaseQuantity(itemId);
  }

  async removeItem(itemId: number) {
    const alert = await this.alertController.create({
      header: 'Remove Item',
      message: 'Are you sure you want to remove this item from cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          handler: () => {
            this.cartService.removeFromCart(itemId);
            this.showToast('Item removed from cart', 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  async clearCart() {
    const alert = await this.alertController.create({
      header: 'Clear Cart',
      message: 'Are you sure you want to remove all items from cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Clear All',
          handler: () => {
            this.cartService.clearCart();
            this.showToast('Cart cleared', 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  async proceedToCheckout() {
    if (this.cartItems.length === 0) {
      this.showToast('Your cart is empty', 'warning');
      return;
    }

    // Navigate to checkout page (you'll create this later)
    this.showToast('Proceeding to checkout...', 'success');
    // this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.navCtrl.back();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}