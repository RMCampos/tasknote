import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIf, NgForOf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  tags: string[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.getHomeTags().subscribe({
      next: (tagList) => {
        this.tags = tagList;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load tasks: ${JSON.stringify(err)}`;
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadHighPriorityTasks(): void {
    console.log('loadHighPriorityTasks');
  }

  doLogout(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
