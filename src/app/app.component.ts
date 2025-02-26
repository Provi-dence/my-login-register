import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { AuthService } from './_service/auth.service';
import { ThemeService } from './_service/theme.services';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Ensure it's standalone
  imports: [RouterOutlet, CommonModule], // ✅ Import CommonModule
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  currentTheme: string = 'light';
  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Get saved theme from localStorage (default to "light")
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);

    // Sync the checkbox state based on the saved theme
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    if (themeToggle) {
      themeToggle.checked = savedTheme === 'dim'; // Checked if dim, unchecked if light
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
  }
}
