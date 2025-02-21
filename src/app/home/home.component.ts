import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_service/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    
})
export class HomeComponent implements OnInit {


    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
    }

    direct() {
        if(this.isLoggedIn()){
            this.router.navigate(['/home']);
        } else {
            this.router.navigate(['/auth/login']);
        }
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
}