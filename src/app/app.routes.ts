import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NivelesComponent } from './niveles/niveles.component';
import { JuegoComponent } from './juego/juego.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PuntajeComponent } from './puntajes/puntajes.component';
import { RankingComponent } from './ranking/ranking.component';
import { StreakComponent } from './streak/streak.component';
import { ProgresoComponent } from './progreso/progreso.component';
import { PopularCategoriesComponent } from './popular-categories/popular-categories.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'racha', component: StreakComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'loggin', component: LoginComponent },
  { path: 'puntaje', component: PuntajeComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'progreso', component: ProgresoComponent },
  { path: 'popular-categories', component: PopularCategoriesComponent },
  { path: 'niveles/:categoryId/:categoryName', component: NivelesComponent },
  { path: 'juego/:categoryId/:categoryName/:level', component: JuegoComponent },
  { path: 'user-profile/:userId', component: UserProfileComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];
