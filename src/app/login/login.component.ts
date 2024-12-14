import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }
  
    const { username, password } = this.loginForm.value;
  
    this.http.post('http://localhost:3000/getProfile', { username, password })
      .subscribe({
        next: (response: any) => {
          if (response) {
            alert('Login exitoso');
            // Guardar el nombre del usuario en localStorage
            localStorage.setItem('username', username);
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Credenciales incorrectas.';
          }
        },
        error: () => {
          this.errorMessage = 'Error en el servidor. Inténtelo más tarde.';
        }
      });
  }
  
}
