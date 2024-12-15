import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NivelesComponent } from './niveles/niveles.component';
import { JuegoComponent } from './juego/juego.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PuntajeComponent } from './puntajes/puntajes.component';
import { RankingComponent } from './ranking/ranking.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'loggin', component: LoginComponent },
    { path: 'puntaje', component: PuntajeComponent },
    { path: 'ranking', component: RankingComponent },
    { path: 'niveles/:categoria', component: NivelesComponent },
    { path: 'juego/:categoria/:level', component: JuegoComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'home'}
];
