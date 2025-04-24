import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WorkerDto, WorkerDetailDto } from '../models/worker.model';
import { CreateWorkerDto, UpdateWorkerDto } from '../models/worker-input.model';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/workers`; 

  getWorkers(): Observable<WorkerDto[]> {
    console.log(`WorkerService: requesting GET ${this.apiUrl}`);
    return this.http.get<WorkerDto[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getWorkerDetail(enrollment: string): Observable<WorkerDetailDto> {
    const url = `${this.apiUrl}/${enrollment}`;
    console.log(`WorkerService: requesting GET ${url}`);
    return this.http.get<WorkerDetailDto>(url).pipe(catchError(this.handleError));
  }

  createWorker(workerData: CreateWorkerDto): Observable<WorkerDetailDto> {
    console.log(`WorkerService: requesting POST ${this.apiUrl}`);
    return this.http.post<WorkerDetailDto>(this.apiUrl, workerData).pipe(catchError(this.handleError));
  }

  updateWorker(enrollment: string, workerData: UpdateWorkerDto): Observable<void> {
    const url = `${this.apiUrl}/${enrollment}`;
    console.log(`WorkerService: requesting PUT ${url}`);
    return this.http.put<void>(url, workerData).pipe(catchError(this.handleError));
  }

  deleteWorker(enrollment: string): Observable<void> {
     const url = `${this.apiUrl}/${enrollment}`;
     console.log(`WorkerService: requesting DELETE ${url}`);
     return this.http.delete<void>(url).pipe(catchError(this.handleError));
   }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error (WorkerService):', error);
    let userMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
       userMessage = `Network error: ${error.error.message}`;
    } else {
        const errorBodyMessage = error.error?.message || error.error?.title || error.message;
        userMessage = `API error: Status ${error.status} - ${errorBodyMessage || error.statusText}`;
        if (error.status === 404) { userMessage = 'Worker not found (404).'; }
        else if (error.status === 409) { userMessage = `Conflict: ${errorBodyMessage || 'Enrollment already exists.'} (409).`; }
        else if (error.status === 400) { userMessage = `Invalid data: ${errorBodyMessage || 'Bad Request'} (400).`; }
    }
    return throwError(() => new Error(userMessage));
  }
}

