import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NivelesComponent } from './niveles/niveles.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'niveles/:id', component: NivelesComponent },
    {path: '**', pathMatch: 'full', redirectTo: 'home'},
    
];
