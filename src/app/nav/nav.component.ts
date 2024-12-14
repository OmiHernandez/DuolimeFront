import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  constructor(private router: Router) {}

  // Obtener el username desde localStorage
  get username(): string | null {
    return localStorage.getItem('username');
  }

  // Función para cerrar sesión
  logout(): void {
    // Eliminar el username del localStorage
    localStorage.removeItem('username');
    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/loggin']);
  }
}