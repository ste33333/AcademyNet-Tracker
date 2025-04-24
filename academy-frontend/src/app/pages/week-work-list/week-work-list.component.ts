import { Component, OnInit, inject, OnDestroy, NgZone } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, of, Subscription, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { WeekWorkService } from '../../services/week-work.service';
import { WorkerService } from '../../services/worker.service';
import { WeekWorkDto } from '../../models/week-work.model';
import { CreateWeekWorkDto, UpdateWeekWorkDto } from '../../models/week-work-input.model';
import { WeekWorkWithWorkerDto } from '../../models/week-work-with-worker.model'; 
import { WorkerDto } from '../../models/worker.model'; 

import { HttpErrorResponse } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-week-work-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ReactiveFormsModule], 
  templateUrl: './week-work-list.component.html',
  styleUrls: ['./week-work-list.component.css'] 
})
export class WeekWorkListComponent implements OnInit, OnDestroy {
  private weekWorkService = inject(WeekWorkService);
  private workerService = inject(WorkerService);
  private fb = inject(FormBuilder);
  private zone = inject(NgZone);

  weekWorks: WeekWorkWithWorkerDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null; 

  weekWorkForm!: FormGroup;
  editingWeekWork: WeekWorkWithWorkerDto | null = null; 
  isModalLoading = false;
  modalErrorMessage: string | null = null;
  private modalInstance: any = null;

  availableWorkers: WorkerDto[] = [];

  ngOnInit(): void {
    this.initWeekWorkForm();
    this.loadAllWeekWorks(); 
    this.loadAvailableWorkers(); 
  }

  ngOnDestroy(): void {
    this.destroyModalInstance(); 
  }

  loadAllWeekWorks(): void {
    this.isLoading = true; this.errorMessage = null; this.successMessage = null; 
    console.log('Loading all week works...');
    this.weekWorkService.getAllWeekWorks().pipe(
      tap(data => console.log(`Received ${data.length} week works.`)),
      catchError(this.handleLoadError),
      finalize(() => { this.zone.run(() => { this.isLoading = false; }); }) 
    ).subscribe(data => { this.zone.run(() => { this.weekWorks = data ?? []; }); }); 
  }

  loadAvailableWorkers(): void {
     this.workerService.getWorkers().pipe(
         catchError(err => { console.error("Failed to load workers for dropdown", err); return of([]); })
     ).subscribe(workers => { this.availableWorkers = workers; });
  }

   private handleLoadError = (error: HttpErrorResponse): Observable<null> => {
        this.zone.run(() => {
            this.errorMessage = `Could not load week works: ${error.message || 'Server error'}`;
        });
        return of(null);
   }

  // --- Logica Modale WeekWork ---
  initWeekWorkForm(): void {
    this.weekWorkForm = this.fb.group({
       workerEnrollment: [{value: '', disabled: false}, Validators.required], 
       workDate: ['', Validators.required],
       activity: ['', Validators.maxLength(50)]
    });
  }
  get modalF() { return this.weekWorkForm.controls; }

  openAddWeekWorkModal(): void {
    this.editingWeekWork = null;
    this.modalF['workerEnrollment'].enable(); 
    this.weekWorkForm.reset({ workDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'), workerEnrollment: '' });
    this.modalErrorMessage = null; this.showModal();
  }

  openEditWeekWorkModal(activity: WeekWorkWithWorkerDto): void {
    if (!activity) return;
    this.editingWeekWork = activity;
    const formattedDate = activity.workDate ? formatDate(activity.workDate, 'yyyy-MM-dd', 'en-US') : '';
    this.modalF['workerEnrollment'].disable(); 
    this.weekWorkForm.patchValue({
      workerEnrollment: activity.workerEnrollement, 
      workDate: formattedDate,
      activity: activity.activity
    });
    this.modalErrorMessage = null; this.showModal();
  }

  closeWeekWorkModal(): void { this.hideModal(); }

  saveWeekWork(): void {
     if (this.weekWorkForm.invalid) { return; }
     this.isModalLoading = true; this.modalErrorMessage = null;
     const formData = this.weekWorkForm.getRawValue();
     let operation$: Observable<any>;

     if (this.editingWeekWork) { 
       const updateData: UpdateWeekWorkDto = { workDate: formData.workDate, activity: formData.activity };
       operation$ = this.weekWorkService.updateWeekWork(this.editingWeekWork.id, updateData);
     } else { 
        const createData: CreateWeekWorkDto = { workDate: formData.workDate, activity: formData.activity };
        const selectedEnrollment = formData.workerEnrollment;
         if (!selectedEnrollment) { return; }
        operation$ = this.weekWorkService.addWeekWork(selectedEnrollment, createData);
     }

     operation$.pipe(
         catchError(this.handleModalError),
         finalize(() => { this.zone.run(() => { this.isModalLoading = false; }); })
     ).subscribe(result => {
         this.zone.run(() => {
             if (!this.modalErrorMessage) {
                console.log('WeekWork Save/Update successful.');
                this.hideModal();
                this.successMessage = `Activity ${this.editingWeekWork ? 'updated' : 'added'} successfully.`; // Messaggio successo
                this.loadAllWeekWorks(); 
             }
         });
      });
  }

  deleteWeekWork(activity: WeekWorkWithWorkerDto): void {
     if (!activity) return;
     const formattedDate = formatDate(activity.workDate, 'yyyy-MM-dd', 'en-US');
     if (confirm(`Delete activity for ${activity.workerFullName} on ${formattedDate}?`)) {
        this.errorMessage = null; 
        this.successMessage = null;
        this.weekWorkService.deleteWeekWork(activity.id).pipe(
             catchError(error => { this.zone.run(() => { this.errorMessage = error.message || 'Could not delete activity.'; }); return of(null); })
        ).subscribe(result => { this.zone.run(() => { if (!this.errorMessage) { this.successMessage = 'Activity deleted successfully.'; this.loadAllWeekWorks(); } }); });
     }
   }

   private handleModalError = (error: HttpErrorResponse): Observable<null> => { this.zone.run(() => { this.modalErrorMessage = `Operation failed: ${error.error?.message || 'Server error'}`; }); return of(null); }
   
   // Helpers Modale Bootstrap
   private showModal(): void { const el = document.getElementById('weekWorkModalList'); if(el){ this.modalInstance = bootstrap.Modal.getOrCreateInstance(el); this.modalInstance.show(); } else { console.error("Modal #weekWorkModalList not found!")} }
   private hideModal(): void { if(this.modalInstance){ this.modalInstance.hide(); } this.editingWeekWork=null; this.modalErrorMessage=null;}
   private destroyModalInstance(): void { const el = document.getElementById('weekWorkModalList'); if(el){ bootstrap.Modal.getInstance(el)?.dispose();} this.modalInstance = null;}
}