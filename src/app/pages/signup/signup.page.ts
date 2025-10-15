import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  fullName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  acceptTerms: boolean = false;
  
  passwordStrength: number = 0;
  passwordStrengthText: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordStrength() {
    const password = this.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    this.passwordStrength = strength;
    
    switch(strength) {
      case 0:
      case 1:
        this.passwordStrengthText = 'Weak password';
        break;
      case 2:
        this.passwordStrengthText = 'Fair password';
        break;
      case 3:
        this.passwordStrengthText = 'Good password';
        break;
      case 4:
        this.passwordStrengthText = 'Strong password';
        break;
    }
  }

  async onSignup() {
    if (this.password !== this.confirmPassword) {
      const toast = await this.toastController.create({
        message: 'Passwords do not match!',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    if (this.fullName && this.email && this.phone && this.password && this.acceptTerms) {
      // Here you would typically call your authentication service
      const toast = await this.toastController.create({
        message: 'Account created successfully!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
      
      // Navigate to dashboard
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 500);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}