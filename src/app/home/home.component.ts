import { Component } from '@angular/core';
import { CategoriesComponent } from "../categories/categories.component";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategoriesComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  get username(): string | null {
    return localStorage.getItem('username');
  }
}
