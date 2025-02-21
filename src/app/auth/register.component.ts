import { Component } from '@angular/core';
import { AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.email, this.password).subscribe({
      next: (res: { message: string }) => alert(res.message),
      error: (err: { error: string }) => alert(err.error)
    });
  }
}
