import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NivelesComponent } from './niveles/niveles.component';
import { JuegoComponent } from './juego/juego.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'niveles/:categoria', component: NivelesComponent },
    { path: 'juego/:categoria/:level', component: JuegoComponent },
    {path: '**', pathMatch: 'full', redirectTo: 'home'},

];
