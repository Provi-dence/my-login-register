import { Component } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[RouterModule]
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
        next: (res: { message: string }) => alert(res.message),
        error: (err: { error: string }) => alert(err.error)
    });
  }
}
