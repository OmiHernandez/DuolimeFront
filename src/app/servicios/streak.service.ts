import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreakService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getStreak(userId: string): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/updateRacha`, { id: userId });
  }
}
