import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (this.email && this.password) {
      try {
        // Get stored user data
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          
          // Verify credentials
          if (userData.email === this.email && userData.password === this.password) {
            // Successful login
            localStorage.setItem('isLoggedIn', 'true');
            
            const toast = await this.toastController.create({
              message: `Welcome back, ${userData.fullName}!`,
              duration: 2000,
              color: 'success',
              position: 'top'
            });
            await toast.present();
            
            // Navigate to dashboard
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          } else {
            // Invalid credentials
            const toast = await this.toastController.create({
              message: 'Invalid email or password!',
              duration: 2000,
              color: 'danger',
              position: 'top'
            });
            await toast.present();
          }
        } else {
          // No user found
          const toast = await this.toastController.create({
            message: 'No account found. Please sign up first!',
            duration: 2000,
            color: 'warning',
            position: 'top'
          });
          await toast.present();
        }
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Error logging in. Please try again.',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Please enter email and password!',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}