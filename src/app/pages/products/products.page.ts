import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { CartService } from '../../services/cart';
import { Subscription } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  carType: string;
  brand: string;
  isWishlisted: boolean;
}

@Component({
  standalone: false,
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {
  carType: string = '';
  brand: string = '';
  searchQuery: string = '';
  selectedFilter: string = 'all';
  cartCount: number = 0;
  
  private cartSubscription!: Subscription;

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private cartService: CartService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Get query parameters
    this.route.queryParams.subscribe(params => {
      this.carType = params['type'] || '';
      this.brand = params['brand'] || '';
      this.loadProducts();
    });

    // Subscribe to cart count
    this.cartSubscription = this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadProducts() {
    // Generate sample products based on car type
    this.allProducts = this.generateProducts();
    this.filteredProducts = [...this.allProducts];
  }

  generateProducts(): Product[] {
    const categories = [
      { 
        name: 'oils', 
        label: 'Oils & Fluids',
        products: [
          { name: 'Engine Oil 5W-30', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop' },
          { name: 'Brake Fluid DOT 4', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop' },
          { name: 'Transmission Fluid', image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop' },
          { name: 'Power Steering Fluid', image: 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=400&h=300&fit=crop' }
        ]
      },
      { 
        name: 'cleaning', 
        label: 'Cleaning',
        products: [
          { name: 'Car Shampoo Wash', image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=300&fit=crop' },
          { name: 'Interior Cleaner', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop' },
          { name: 'Glass Cleaner Spray', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop' },
          { name: 'Dashboard Polish', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop' },
          { name: 'Microfiber Cloth Set', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=300&fit=crop' }
        ]
      },
      { 
        name: 'accessories', 
        label: 'Accessories',
        products: [
          { name: 'Phone Holder Mount', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop' },
          { name: 'Seat Cover Set', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop' },
          { name: 'Floor Mat Premium', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop' },
          { name: 'Steering Wheel Cover', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop' },
          { name: 'Sunshade Protector', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop' }
        ]
      },
      { 
        name: 'parts', 
        label: 'Parts',
        products: [
          { name: 'Brake Pads Set', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop' },
          { name: 'Air Filter Element', image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop' },
          { name: 'Wiper Blades Pair', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop' },
          { name: 'Oil Filter Premium', image: 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=400&h=300&fit=crop' },
          { name: 'Battery 12V 65Ah', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop' }
        ]
      }
    ];

    const products: Product[] = [];
    let productId = 1;

    categories.forEach((category) => {
      category.products.forEach((product) => {
        const hasDiscount = Math.random() > 0.6;
        const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
        const originalPrice = Math.floor(Math.random() * 3000) + 500;
        const price = hasDiscount ? Math.floor(originalPrice * (1 - discount / 100)) : originalPrice;

        products.push({
          id: productId++,
          name: `${this.carType ? this.carType + ' ' : ''}${product.name}`,
          price: price,
          originalPrice: hasDiscount ? originalPrice : undefined,
          discount: discount,
          image: product.image,
          category: category.label,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          reviews: Math.floor(Math.random() * 200) + 10,
          carType: this.carType || 'Universal',
          brand: this.brand || 'Premium Auto',
          isWishlisted: false
        });
      });
    });

    return products;
  }

  filterProducts(filter: string) {
    this.selectedFilter = filter;
    
    if (filter === 'all') {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter(product => {
        const categoryMap: { [key: string]: string } = {
          'oils': 'Oils & Fluids',
          'cleaning': 'Cleaning',
          'accessories': 'Accessories',
          'parts': 'Parts'
        };
        return product.category === categoryMap[filter];
      });
    }

    this.applySearch();
  }

  onSearch() {
    this.applySearch();
  }

  applySearch() {
    if (this.searchQuery.trim() === '') {
      return;
    }

    this.filteredProducts = this.filteredProducts.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleSort() {
    // Toggle between price low-high and high-low
    this.filteredProducts.reverse();
  }

  toggleWishlist(product: Product) {
    product.isWishlisted = !product.isWishlisted;
    const message = product.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist';
    this.showToast(message, 'medium');
  }

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  async addToCart(product: Product) {
    if (this.isInCart(product.id)) {
      this.showToast('Product already in cart', 'warning');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      carType: product.carType,
      brand: product.brand
    };

    this.cartService.addToCart(cartItem);
    this.showToast(`${product.name} added to cart!`, 'success');
  }

  openCart() {
    this.router.navigate(['/cart']);
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