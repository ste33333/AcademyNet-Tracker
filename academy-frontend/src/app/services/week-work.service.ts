import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { WeekWorkDto } from '../models/week-work.model'; 
import { CreateWeekWorkDto, UpdateWeekWorkDto } from '../models/week-work-input.model'; 
import { WeekWorkWithWorkerDto } from '../models/week-work-with-worker.model'; 

@Injectable({
  providedIn: 'root'
})
export class WeekWorkService {
  private http = inject(HttpClient);
  private baseApiUrl = `${environment.apiUrl}/weekworks`; 
  private workerApiUrl = `${environment.apiUrl}/workers`; 

  getAllWeekWorks(): Observable<WeekWorkWithWorkerDto[]> {
    console.log(`WeekWorkService: requesting GET ${this.baseApiUrl}`); // Usa backtick e ${} per l'URL
    return this.http.get<WeekWorkWithWorkerDto[]>(this.baseApiUrl).pipe(catchError(this.handleError));
  }


  addWeekWork(enrollment: string, weekWorkData: CreateWeekWorkDto): Observable<WeekWorkDto> {
    const url = `${this.workerApiUrl}/${enrollment}/weekwork`; // Interpolazione URL
    console.log(`WeekWorkService: requesting POST ${url}`); 
    return this.http.post<WeekWorkDto>(url, weekWorkData).pipe(catchError(this.handleError));
  }

  updateWeekWork(id: number, weekWorkData: UpdateWeekWorkDto): Observable<void> {
    const url = `${this.baseApiUrl}/${id}`; // Interpolazione URL
    console.log(`WeekWorkService: requesting PUT ${url}`); 
    return this.http.put<void>(url, weekWorkData).pipe(catchError(this.handleError));
  }

  deleteWeekWork(id: number): Observable<void> {
    const url = `${this.baseApiUrl}/${id}`; // Interpolazione URL
    console.log(`WeekWorkService: requesting DELETE ${url}`); 
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  // Gestione Errori
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error (WeekWorkService):', error);
    let userMessage = 'An unknown error occurred with WeekWork operation!';
    if (error.error instanceof ErrorEvent) { userMessage = `Network error: ${error.error.message}`; }
    else { const errorBodyMessage = error.error?.message || error.error?.title || error.message; userMessage = `API error: Status ${error.status} - ${errorBodyMessage || error.statusText}`; }
    return throwError(() => new Error(userMessage));
  }
}