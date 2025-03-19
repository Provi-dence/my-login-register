import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { AuthService } from './_service/auth.service';
import { ThemeService } from './_service/theme.services';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import iziToast from 'izitoast';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Ensure it's standalone
  imports: [RouterOutlet, CommonModule], // ✅ Import CommonModule
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  currentTheme: string = 'light';
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.kuhaonAngUser();

    // Get saved theme from localStorage (default to "light")
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);

    // Sync the checkbox state based on the saved theme
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    if (themeToggle) {
      themeToggle.checked = savedTheme === 'dim'; // Checked if dim, unchecked if light
    }

    this.kuhaonAngUser();


      console.log('user:', this.currentUser);
  }


  kuhaonAngUser(){
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.http.get<any[]>('http://localhost:4200/users').subscribe(data => {
          this.currentUser = data.find(user => user.id === userId);
      });
    }
  }

  toggleTheme(event: Event) {
    const target = event.target as HTMLInputElement;
    const newTheme = target.checked ? 'dim' : 'light'; // If checked, dim. Else, light.
    this.setTheme(newTheme);
  }

  setTheme(theme: string) {
    // Apply theme using DaisyUI's data-theme
    this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update checkbox state (ensures it stays in sync)
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    if (themeToggle) {
      themeToggle.checked = theme === 'dim';
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
    iziToast.success({
      title: 'Logged Out',
      message: 'You have been successfully logged out.',
      position: 'topRight',
      timeout: 3000,
    });
  }
}
