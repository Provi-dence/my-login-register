import { Component } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [RouterModule, FormsModule, CommonModule] 
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.showAlert('Email and password are required!', 'warning');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res: { message: string; token: string }) => {
        // Store the token (simulating authentication)
        localStorage.setItem('authToken', res.token);

        this.showAlert('Login successfully', 'success');

        // ✅ Redirect to home after 2 seconds
        setTimeout(() => {
          this.router.navigateByUrl('/home');
        }, 2000);
      },
      error: () => this.showAlert('Login failed! Invalid credentials', 'error')
    });
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    Swal.fire({
      text: message,
      icon: type,
      timer: 3000,
      showConfirmButton: false,
      toast: false,
      position: 'top',
      width: '800px',
      customClass: {
        popup: 'custom-swal'
      }
    });
  }
}
