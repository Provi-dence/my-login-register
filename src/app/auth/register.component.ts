import { Component } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { Router } from '@angular/router'; // ✅ Import Router
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [RouterModule, FormsModule, CommonModule]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) {} // ✅ Inject Router

  register() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.showAlert('All fields are required!', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showAlert('Passwords do not match!', 'warning');
      return;
    }

    this.authService.register(this.email, this.password, this.fullName).subscribe({
      next: (res: { message: string }) => {
        this.showAlert('Registration successful', 'success');

        //  Redirect to login page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err: { error: string }) => this.showAlert('Registration failed!', 'error')
    });
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    Swal.fire({
      text: message,
      icon: type,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top',
      width: '800px',
      customClass: {
        popup: 'custom-swal'
      }
    });
  }
}
