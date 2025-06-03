import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserProgress, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private userProgressSubject = new BehaviorSubject<UserProgress | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public userProgress$ = this.userProgressSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedProgress = localStorage.getItem('userProgress');
    
    if (storedUser && storedProgress) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
        this.userProgressSubject.next(JSON.parse(storedProgress));
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          const defaultProgress: UserProgress = {
            level: 1,
            xp: 0,
            completedMissions: [],
            completedQuizzes: [],
            unlockedLocations: ['headquarters']
          };
          
          const progress = response.progress || defaultProgress;
          
          this.currentUserSubject.next(response.user);
          this.userProgressSubject.next(progress);
          
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('userProgress', JSON.stringify(progress));
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.userProgressSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProgress');
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserProgress(): UserProgress | null {
    return this.userProgressSubject.value;
  }

  updateUserProgress(progress: Partial<UserProgress>): void {
    const currentProgress = this.userProgressSubject.value;
    if (currentProgress) {
      const updatedProgress = { ...currentProgress, ...progress };
      this.userProgressSubject.next(updatedProgress);
      localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
    }
  }
}