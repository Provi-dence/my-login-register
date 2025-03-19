import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_service/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    currentUser: any = null;  // Store the logged-in user's data

    constructor(
        private router: Router,
        private authService: AuthService,
        private http: HttpClient
    ) { }

    ngOnInit() {
      const userId = this.authService.getCurrentUserId();

      if (userId) {
          this.http.get<any[]>('http://localhost:4200/users').subscribe(data => {
              this.currentUser = data.find(user => user.id === userId);
          });
      }
  }


    direct() {
        if (this.isLoggedIn()) {
            this.router.navigate(['/home']);
        } else {
            this.router.navigate(['/auth/login']);
        }
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
}
