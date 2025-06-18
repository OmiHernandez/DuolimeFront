import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreakService {

  private apiUrl = ' https://next-eel-firmly.ngrok-free.app';

  constructor(private http: HttpClient) {}

  getStreak(userId: string): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/updateRacha`, { id: userId });
  }
}
