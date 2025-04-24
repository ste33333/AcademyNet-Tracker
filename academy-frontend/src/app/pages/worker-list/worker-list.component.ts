import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs'; 
import { catchError, finalize, tap } from 'rxjs/operators';
import { WorkerService } from '../../services/worker.service';
import { WorkerDto } from '../../models/worker.model';

@Component({
  selector: 'app-worker-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.css']
})
export class WorkerListComponent implements OnInit {
  private workerService = inject(WorkerService);

  workers: WorkerDto[] = []; // Inizializza workers come array vuoto perche non è ancora caricato
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadWorkers(); // Carica i dati all'inizializzazione
  }

  loadWorkers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    console.log('Starting to load workers...'); 

    this.workerService.getWorkers().pipe(
      tap(data => console.log(`Received ${data.length} workers.`)), 
      catchError(error => {
        console.error('Error loading workers:', error);
        this.errorMessage = `Could not load workers. Status: ${error.status} - ${error.statusText || error.message || 'Unknown error'}`;
        return []; 
      }),
      finalize(() => {
        this.isLoading = false; 
        console.log('Worker loading finished.'); 
      })
    ).subscribe(workersData => {
      this.workers = workersData; 
    });
  }
}
