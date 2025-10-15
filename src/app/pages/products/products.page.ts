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
          'Engine Oil 5W-30',
          'Synthetic Motor Oil',
          'Brake Fluid DOT 4',
          'Coolant Antifreeze',
          'Transmission Fluid',
          'Power Steering Fluid'
        ]
      },
      { 
        name: 'cleaning', 
        label: 'Cleaning',
        products: [
          'Car Shampoo Wash',
          'Interior Cleaner',
          'Glass Cleaner Spray',
          'Tire Shine Polish',
          'Dashboard Polish',
          'Microfiber Cloth Set'
        ]
      },
      { 
        name: 'accessories', 
        label: 'Accessories',
        products: [
          'Car Air Freshener',
          'Phone Holder Mount',
          'Seat Cover Set',
          'Floor Mat Premium',
          'Steering Wheel Cover',
          'Sunshade Protector'
        ]
      },
      { 
        name: 'parts', 
        label: 'Parts',
        products: [
          'Brake Pads Set',
          'Air Filter Element',
          'Wiper Blades Pair',
          'Spark Plugs Set',
          'Oil Filter Premium',
          'Battery 12V 65Ah'
        ]
      }
    ];

    const products: Product[] = [];
    let productId = 1;

    // Product images from Picsum (reliable image service)
    const imageIds = [237, 431, 244, 250, 367, 423, 180, 112, 
                      193, 225, 257, 292, 325, 357, 390, 418, 
                      452, 485, 516, 547, 577, 607, 637, 667];

    categories.forEach((category, catIndex) => {
      category.products.forEach((productName, i) => {
        const hasDiscount = Math.random() > 0.6;
        const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
        const originalPrice = Math.floor(Math.random() * 3000) + 500;
        const price = hasDiscount ? Math.floor(originalPrice * (1 - discount / 100)) : originalPrice;
        const imageIndex = (catIndex * 6 + i) % imageIds.length;

        products.push({
          id: productId++,
          name: `${this.carType ? this.carType + ' ' : ''}${productName}`,
          price: price,
          originalPrice: hasDiscount ? originalPrice : undefined,
          discount: discount,
          image: `https://picsum.photos/seed/${imageIds[imageIndex]}/400/300`,
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