import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  notificationsEnabled: boolean = true;
  darkModeEnabled: boolean = false;
  
  // User data
  userName: string = 'John Doe';
  userEmail: string = 'john.doe@example.com';
  userPhone: string = '+91 1234567890';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        this.userName = userData.fullName || 'John Doe';
        this.userEmail = userData.email || 'john.doe@example.com';
        this.userPhone = userData.phone || '+91 1234567890';
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  editProfile() {
    this.showToast('Edit profile feature coming soon!', 'primary');
  }

  navigateTo(page: string) {
    // You can create these pages later
    this.showToast(`${this.formatPageName(page)} feature coming soon!`, 'primary');
  }

  formatPageName(page: string): string {
    return page.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  toggleDarkMode() {
    if (this.darkModeEnabled) {
      document.body.classList.add('dark');
      this.showToast('Dark mode enabled', 'dark');
    } else {
      document.body.classList.remove('dark');
      this.showToast('Dark mode disabled', 'light');
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Logout',
          handler: () => {
            this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  async performLogout() {
    try {
      // Clear login status but keep user data for future login
      localStorage.setItem('isLoggedIn', 'false');
      
      const toast = await this.toastController.create({
        message: 'Logged out successfully',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      // Navigate to login page
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error during logout:', error);
    }
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