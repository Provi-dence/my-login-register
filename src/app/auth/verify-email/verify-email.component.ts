import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../_service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  templateUrl: './verify-email.component.html',
  imports: [FormsModule],
})
export class VerifyEmailComponent {
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  verifyEmail() {
    if (!this.email) {
      this.showAlert('Please enter your email to verify.', 'warning');
      return;
    }

    this.authService.verifyEmail(this.email).subscribe(
      () => {
        this.showAlert('Email verified successfully! Redirecting to login...', 'success');
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      (error) => {
        this.showAlert(error.error || 'Verification failed. Please try again.', 'error');
      }
    );
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
