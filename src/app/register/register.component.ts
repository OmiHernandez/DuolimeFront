import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
    this.enviarCorreo(this.email, password)
    .then(() => {
      // Enviar datos al backend después de un correo exitoso
      this.http
        .post('https://next-eel-firmly.ngrok-free.app/registerProfile', {
          username: this.nombre,
          password,
        })
        .subscribe({
          next: () => {
            // Mensaje de éxito con SweetAlert
            Swal.fire({
              icon: 'success',
              title: 'Usuario registrado',
              text: 'El usuario fue registrado y el correo se envió correctamente.',
              confirmButtonText: 'Aceptar',
            });

            // Limpiar formulario
            this.limpiarFormulario();
          },
          error: (err) => {
            console.error('Error al registrar el usuario:', err);
            // Mensaje de error con SweetAlert
            Swal.fire({
              icon: 'error',
              title: 'Error al registrar',
              text: 'Hubo un problema al registrar el usuario.',
              confirmButtonText: 'Aceptar',
            });
          },
        });
    })
    .catch(() => {
      // Mensaje de error al enviar el correo
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar correo',
        text: 'No se pudo enviar el correo electrónico.',
        confirmButtonText: 'Aceptar',
      });
    });

    // Enviar datos al backend
    /*this.http
      .post('http://localhost:3000/registerProfile', {
        username: this.nombre,
        password,
      })
      .subscribe((response) => {
        console.log('Usuario registrado:', response);
      });*/
  }

  enviarCorreo(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post('https://next-eel-firmly.ngrok-free.app/enviarCorreo', { email, password })
        .subscribe({
          next: (response) => {
            console.log('Correo enviado:', response);
            resolve();
          },
          error: (err) => {
            console.error('Error al enviar el correo:', err);
            reject(err);
          },
        });
    });
  }

  limpiarFormulario() {
    this.nombre = '';
    this.email = '';
  }
}
