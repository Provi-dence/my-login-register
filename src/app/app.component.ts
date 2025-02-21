import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { AuthService } from './_service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Ensure it's standalone
  imports: [RouterOutlet, CommonModule], // ✅ Import CommonModule
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated(); // ✅ Calls auth service
  }
}
