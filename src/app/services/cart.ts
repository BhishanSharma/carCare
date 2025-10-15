import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  carType?: string;
  brand?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);
  private cartTotalSubject = new BehaviorSubject<number>(0);

  constructor() {
    // Load cart from memory on initialization
    this.loadCart();
  }

  // Get cart items as observable
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Get cart count as observable
  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  // Get cart total as observable
  getCartTotal(): Observable<number> {
    return this.cartTotalSubject.asObservable();
  }

  // Get current cart items
  getCurrentCart(): CartItem[] {
    return this.cartItems;
  }

  // Add item to cart
  addToCart(item: CartItem): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // If item exists, increase quantity
      existingItem.quantity += item.quantity;
    } else {
      // Add new item
      this.cartItems.push(item);
    }
    
    this.updateCart();
  }

  // Remove item from cart
  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCart();
  }

  // Update item quantity
  updateQuantity(itemId: number, quantity: number): void {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  // Increase quantity
  increaseQuantity(itemId: number): void {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
      item.quantity++;
      this.updateCart();
    }
  }

  // Decrease quantity
  decreaseQuantity(itemId: number): void {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.updateCart();
      } else {
        this.removeFromCart(itemId);
      }
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  // Calculate total
  private calculateTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Calculate total items count
  private calculateCount(): number {
    return this.cartItems.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  }

  // Update all subjects
  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.cartCountSubject.next(this.calculateCount());
    this.cartTotalSubject.next(this.calculateTotal());
    this.saveCart();
  }

  // Save cart to memory (not localStorage)
  private saveCart(): void {
    // Data persists in memory during the session
    // No localStorage needed
  }

  // Load cart from memory
  private loadCart(): void {
    // Initialize with empty cart or keep existing data
    this.updateCart();
  }

  // Check if item exists in cart
  isInCart(itemId: number): boolean {
    return this.cartItems.some(item => item.id === itemId);
  }

  // Get item quantity in cart
  getItemQuantity(itemId: number): number {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  }
}