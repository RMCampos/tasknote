import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { LoginCredentials } from '../../models/credentials';
import { CommonModule } from '@angular/common';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  
  loginForm: FormGroup<LoginForm>;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group<LoginForm>({
      email: this.fb.control('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      password: this.fb.control('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true })
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.errorMessage = null;

    const credentials: LoginCredentials = this.loginForm.value as LoginCredentials;

    this.apiService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error);
        console.log(typeof(error));
        
        let errorMsg = error.error.errorMessage;
        if (error.error.fields && error.error.fields.length > 0) {
          errorMsg += " " + error.error.fields[0].fieldName + " " + error.error.fields[0].fieldMessage;
        }
        this.errorMessage = errorMsg;
      }
    });
  }
}
