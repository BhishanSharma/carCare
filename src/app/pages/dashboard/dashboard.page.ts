import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

interface CarType {
  id: number;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  productCount: number;
}

interface Brand {
  id: number;
  name: string;
  icon: string;
}

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  searchQuery: string = '';
  cartCount: number = 0;
  private cartSubscription!: Subscription;
  
  carTypes: CarType[] = [
    {
      id: 1,
      name: 'Sedan',
      description: 'Luxury & Comfort cars',
      icon: 'car-outline',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      productCount: 850
    },
    {
      id: 2,
      name: 'SUV',
      description: 'Sport Utility Vehicles',
      icon: 'bus-outline',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      productCount: 720
    },
    {
      id: 3,
      name: 'Hatchback',
      description: 'Compact & Efficient',
      icon: 'car-sport-outline',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      productCount: 650
    },
    {
      id: 4,
      name: 'Sports',
      description: 'High Performance',
      icon: 'rocket-outline',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      productCount: 480
    },
    {
      id: 5,
      name: 'Truck',
      description: 'Heavy Duty Vehicles',
      icon: 'cube-outline',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      productCount: 390
    },
    {
      id: 6,
      name: 'Electric',
      description: 'Eco-Friendly Cars',
      icon: 'flash-outline',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      productCount: 520
    },
    {
      id: 7,
      name: 'Convertible',
      description: 'Open Top Vehicles',
      icon: 'sunny-outline',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      productCount: 280
    },
    {
      id: 8,
      name: 'Minivan',
      description: 'Family Vehicles',
      icon: 'people-outline',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      productCount: 340
    }
  ];

  filteredCars: CarType[] = [];

  popularBrands: Brand[] = [
    { id: 1, name: 'Toyota', icon: 'car' },
    { id: 2, name: 'BMW', icon: 'car-sport' },
    { id: 3, name: 'Mercedes', icon: 'star' },
    { id: 4, name: 'Audi', icon: 'diamond' },
    { id: 5, name: 'Honda', icon: 'car' },
    { id: 6, name: 'Ford', icon: 'shield' },
    { id: 7, name: 'Tesla', icon: 'flash' },
    { id: 8, name: 'Porsche', icon: 'rocket' }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.filteredCars = this.carTypes;
    
    // Subscribe to cart count changes
    this.cartSubscription = this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  }

  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.filteredCars = this.carTypes;
    } else {
      this.filteredCars = this.carTypes.filter(car =>
        car.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        car.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  selectCarType(car: CarType) {
    // Navigate to products page with car type
    this.router.navigate(['/products'], { 
      queryParams: { 
        type: car.name,
        carId: car.id 
      } 
    });
  }

  selectBrand(brand: Brand) {
    // Navigate to products page with brand filter
    this.router.navigate(['/products'], { 
      queryParams: { 
        brand: brand.name,
        brandId: brand.id 
      } 
    });
  }

  openCart() {
    this.router.navigate(['/cart']);
  }

  goToCategories() {
    console.log('Navigate to categories');
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  // Navigate to products page for specific car type
  viewProducts(car: CarType) {
    this.router.navigate(['/products'], { 
      queryParams: { 
        type: car.name,
        carId: car.id 
      } 
    });
  }
}