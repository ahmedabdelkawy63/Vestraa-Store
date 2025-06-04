import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  AuthService = inject(AuthService);
  isloged: boolean = false;

  Router = inject(Router);
  logout() {
    this.AuthService.logout();
    this.Router.navigate(['/login']);
    this.isloged = false;
  }
}
