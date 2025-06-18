import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-niveles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.css'],
})
export class NivelesComponent implements OnInit {
  categoryId: string | null = null;
  categoryName: string | null = null;
  backgroundStyle = '';
  userId: string | null = null;
  isLoggedIn: boolean = false;
  levels = Array.from({ length: 10 }, (_, index) => ({
    number: index + 1,
    unlocked: false,
  }));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.isLoggedIn = this.userId !== null && this.userId.trim() !== '';

    const categoryIdParam = this.route.snapshot.paramMap.get('categoryId');
    this.categoryId = categoryIdParam;
    this.categoryName = this.route.snapshot.paramMap.get('categoryName');

    console.group('[NivelesComponent DEBUG] ngOnInit - Estado de Inicialización');
    console.log(`1. userId de localStorage (al inicio de ngOnInit): '${this.userId}'`);
    console.log(`2. isLoggedIn (calculado): ${this.isLoggedIn}`);
    console.log(`3. categoryId de ruta: '${this.categoryId}' (tipo: ${typeof this.categoryId})`);
    console.log(`4. categoryName de ruta: '${this.categoryName}' (tipo: ${typeof this.categoryName})`);
    console.groupEnd();

    this.updateBackground();

    if (this.levels.length > 0) {
      this.levels[0].unlocked = true;
    }

    const isCategoryValid =
      this.categoryId !== null &&
      this.categoryId.trim() !== '' &&
      this.categoryName !== null &&
      this.categoryName.trim() !== '';

    if (this.isLoggedIn && isCategoryValid) {
      console.log(
        '[NivelesComponent DEBUG] Condición de acceso CUMPLIDA: Usuario logueado Y datos de categoría válidos. Intentando cargar progreso...'
      );
      this.getUserProgress(this.userId!, this.categoryId!);
    } else {
      console.warn('[NivelesComponent DEBUG] Condición de acceso FALLIDA: Mostrando alerta.');
      console.warn(
        `   Motivo - isLoggedIn: ${this.isLoggedIn} (userId: '${localStorage.getItem('userId')}')`
      );
      console.warn(
        `   Motivo - isCategoryValid: ${isCategoryValid} (categoryId: '${this.categoryId}', categoryName: '${this.categoryName}')`
      );

      Swal.fire({
        icon: 'warning',
        title: 'Acceso Restringido',
        text: 'Para ver y jugar los niveles, debes iniciar sesión Y la categoría debe cargarse correctamente. Por favor, inicia sesión.',
        confirmButtonText: 'Ir a Login',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/loggin']);
        } else {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  updateBackground(): void {
    const backgroundStyles: { [key: string]: string } = {
      Banderas: 'linear-gradient(to bottom, #ff3200, #ff8b00)',
      Series: 'linear-gradient(to bottom, #ff9700, #ffdc00)',
      Películas: 'linear-gradient(to bottom, #ffd500, #a6ff00)',
      'Cultura pop': 'linear-gradient(to bottom, #a2da00, #00da1e)',
      Historia: 'linear-gradient(to bottom, #1ada00, #00da8e)',
      Arte: 'linear-gradient(to bottom, #00da70, #00dad0)',
      Geografía: 'linear-gradient(to bottom, #00dac6, #006dda)',
      Anime: 'linear-gradient(to bottom, #0081da, #2400da)',
      Ciencia: 'linear-gradient(to bottom, #ac64e1, #e164d9)',
      Libros: 'linear-gradient(to bottom, #b200da, #da00a5)',
      Videojuegos: 'linear-gradient(to bottom, #f000d3, #f0006d)',
      Música: 'linear-gradient(to bottom, #f0007f, #f00000)',
    };
    this.backgroundStyle = backgroundStyles[this.categoryName || ''] || '';
  }

  getUserProgress(userId: string, categoryId: string): void {
    this.http
      .post(' https://next-eel-firmly.ngrok-free.app/getProgress', {
        id: userId,
        category: categoryId,
      })
      .subscribe({
        next: (response: any) => {
          const highestAvailableLevel = parseInt(response, 10);
          console.log(
            `[NivelesComponent] Progreso obtenido para Cat ID '${categoryId}': Nivel más alto DISPONIBLE = ${highestAvailableLevel}`
          );
          this.unlockLevelsUpTo(highestAvailableLevel);
        },
        error: (err) => {
          console.warn(
            `[NivelesComponent] Error o no progreso encontrado para Cat ID '${categoryId}'. Asumiendo nivel 1 disponible. Error:`,
            err
          );
          this.unlockLevelsUpTo(1);
        },
      });
  }

  unlockLevelsUpTo(highestAvailableLevel: number): void {
    this.levels.forEach((lvl) => {
      lvl.unlocked = lvl.number <= highestAvailableLevel;
    });
    if (this.levels.length > 0) {
      this.levels[0].unlocked = true;
    }
    console.log(
      '[NivelesComponent] Estado de niveles después de unlockLevelsUpTo:',
      this.levels.map((l) => ({ number: l.number, unlocked: l.unlocked }))
    );
  }

  navigateToSlide(categoryId: string | null, categoryName: string | null, levelNumber: number): void {
    if (
      categoryId !== null &&
      categoryName !== null &&
      this.levels[levelNumber - 1].unlocked
    ) {
      console.log(
        `[NivelesComponent] Navegando a /juego/${categoryId}/${categoryName}/${levelNumber}`
      );
      this.router.navigate(['/juego', categoryId, categoryName, levelNumber]);
    } else {
      console.warn(
        `[NivelesComponent] Nivel ${levelNumber} está bloqueado para la categoría ${categoryName} o faltan datos de categoría.`
      );
      Swal.fire({
        icon: 'info',
        title: 'Nivel Bloqueado',
        text: `Debes completar el nivel ${levelNumber - 1} para desbloquear este nivel. ¡Buena suerte!`,
        confirmButtonText: 'Entendido',
      });
    }
  }
}
