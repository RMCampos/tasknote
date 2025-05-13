import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RegisterCredentials } from '../../models/credentials';

interface RegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
  passwordAgain: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup<RegisterForm>;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group<RegisterForm>({
      email: this.fb.control('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      password: this.fb.control('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true }),
      passwordAgain: this.fb.control('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true })
    });
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.errorMessage = null;

    const credentials: RegisterCredentials = this.registerForm.value as RegisterCredentials;

    this.apiService.register(credentials).subscribe({
      next: (response) => {
        if (response) {
          localStorage.setItem('token', response.token);
        }
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
