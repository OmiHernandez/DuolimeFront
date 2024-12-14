import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nombre = '';
  email = '';

  constructor(private http: HttpClient) {}

  generarContraseña(): string {
    return Math.random().toString(36).slice(-8); // Generar contraseña aleatoria
  }

  registrarUsuario() {
    const password = this.generarContraseña();

    // Log para verificar nombre y contraseña
    console.log(`Nombre: ${this.nombre}, Contraseña: ${password}`);

    // Enviar correo electrónico (implementación simplificada)
    this.enviarCorreo(this.email, password);

    // Enviar datos al backend
    this.http
      .post('http://localhost:3000/registerProfile', {
        username: this.nombre,
        password,
      })
      .subscribe((response) => {
        console.log('Usuario registrado:', response);
      });
  }

  enviarCorreo(email: string, password: string) {
    // Llama a un servicio en el backend para enviar el correo
    this.http
      .post('http://localhost:3000/enviarCorreo', { email, password })
      .subscribe((response) => {
        console.log('Correo enviado:', response);
      });
  }
}
