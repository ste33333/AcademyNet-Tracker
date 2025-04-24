import { Component, OnInit, inject, OnDestroy, NgZone } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, of, Subscription, Observable } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { WorkerService } from '../../services/worker.service';
import { WeekWorkService } from '../../services/week-work.service';
import { WorkerDetailDto } from '../../models/worker.model';
import { WeekWorkDto } from '../../models/week-work.model';
import { CreateWeekWorkDto, UpdateWeekWorkDto } from '../../models/week-work-input.model';
import { HttpErrorResponse } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-worker-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './worker-detail.component.html',
  styleUrls: ['./worker-detail.component.css']
})
export class WorkerDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workerService = inject(WorkerService);
  private weekWorkService = inject(WeekWorkService);
  private fb = inject(FormBuilder);
  private zone = inject(NgZone);

  public Array = Array; 

  worker: WorkerDetailDto | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  weekWorkForm!: FormGroup;
  editingWeekWork: WeekWorkDto | null = null;
  isModalLoading = false;
  modalErrorMessage: string | null = null;
  private modalInstance: any = null;
  private routeSubscription: Subscription | null = null;


  ngOnInit(): void {
    this.initWeekWorkForm();
    this.routeSubscription = this.route.paramMap.subscribe(params => {
        const enrollment = params.get('enrollment');
        if (enrollment) { this.loadWorkerDetails(enrollment); }
        else { this.errorMessage = 'Worker Enrollment not found in URL.'; }
    });
  }

   ngOnDestroy(): void {
     if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
     this.destroyModalInstance();
   }

  loadWorkerDetails(enrollment: string): void {
    this.isLoading = true; this.errorMessage = null;
    this.workerService.getWorkerDetail(enrollment).pipe(
      tap(data => { this.zone.run(() => { this.worker = data; this.errorMessage = null; }); }),
      catchError(this.handleWorkerLoadError),
      finalize(() => { this.zone.run(() => { this.isLoading = false; }); })
    ).subscribe();
  }
   private handleWorkerLoadError = (error: HttpErrorResponse): Observable<null> => { const userMessage = (error.status === 404) ? `Worker not found (404).` : `Could not load worker details: ${error.error?.message || error.message || 'Server error'}`; this.zone.run(() => { this.errorMessage = userMessage; this.worker = null; }); return of(null); }
  initWeekWorkForm(): void { this.weekWorkForm = this.fb.group({ workDate: ['', Validators.required], activity: ['', Validators.maxLength(50)] }); }
  get modalF() { return this.weekWorkForm.controls; }
  openAddWeekWorkModal(): void { this.editingWeekWork = null; this.weekWorkForm.reset({ workDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US') }); this.modalErrorMessage = null; this.showModal(); }
  openEditWeekWorkModal(activity: WeekWorkDto): void { if (!activity) return; this.editingWeekWork = activity; const formattedDate = activity.workDate ? formatDate(activity.workDate, 'yyyy-MM-dd', 'en-US') : ''; this.weekWorkForm.patchValue({ workDate: formattedDate, activity: activity.activity }); this.modalErrorMessage = null; this.showModal(); }
  closeWeekWorkModal(): void { this.hideModal(); }
  saveWeekWork(): void {
     if (this.weekWorkForm.invalid) { this.modalErrorMessage = 'Please check form.'; this.weekWorkForm.markAllAsTouched(); return; }
     if (!this.worker?.enrollment) { this.modalErrorMessage = 'Worker enrollment missing.'; return; }
     this.isModalLoading = true; this.modalErrorMessage = null;
     const formData = this.weekWorkForm.value;
     const currentEnrollment = this.worker.enrollment;
     let operation$: Observable<any>;
     if (this.editingWeekWork) { const updateData: UpdateWeekWorkDto = { workDate: formData.workDate, activity: formData.activity }; operation$ = this.weekWorkService.updateWeekWork(this.editingWeekWork.id, updateData); }
     else { const createData: CreateWeekWorkDto = { workDate: formData.workDate, activity: formData.activity }; operation$ = this.weekWorkService.addWeekWork(currentEnrollment, createData); }
     operation$.pipe( catchError(this.handleModalError), finalize(() => { this.zone.run(() => { this.isModalLoading = false; }); }) ).subscribe(result => { this.zone.run(() => { if (!this.modalErrorMessage) { this.hideModal(); this.loadWorkerDetails(currentEnrollment); } }); });
  }
  deleteWeekWork(activity: WeekWorkDto): void {
     if (!activity) return; const formattedDate = formatDate(activity.workDate, 'yyyy-MM-dd', 'en-US');
     if (confirm(`Delete activity on ${formattedDate}?`)) {
        this.errorMessage = null;
        this.weekWorkService.deleteWeekWork(activity.id).pipe( catchError(error => { this.zone.run(() => { this.errorMessage = error.message || 'Could not delete activity.'; }); return of(null); }) ).subscribe(result => { this.zone.run(() => { if (!this.errorMessage && this.worker?.enrollment) { this.loadWorkerDetails(this.worker.enrollment); } }); });
     }
   }
   private handleModalError = (error: HttpErrorResponse): Observable<null> => { this.zone.run(() => { this.modalErrorMessage = `Operation failed: ${error.error?.message || error.message || 'Server error'}`; }); return of(null); }
   private showModal(): void { const el = document.getElementById('weekWorkModal'); if(el){ this.modalInstance = bootstrap.Modal.getOrCreateInstance(el); this.modalInstance.show(); } }
   private hideModal(): void { if(this.modalInstance){ this.modalInstance.hide(); setTimeout(() => { const b = document.querySelector('.modal-backdrop'); if(b) b.remove(); document.body.classList.remove('modal-open'); document.body.style.overflow = ''; document.body.style.paddingRight = ''; }, 300); } this.editingWeekWork=null; this.modalErrorMessage=null;}
   private destroyModalInstance(): void { const el = document.getElementById('weekWorkModal'); if(el){ bootstrap.Modal.getInstance(el)?.dispose();} const b = document.querySelector('.modal-backdrop'); if(b) b.remove(); document.body.classList.remove('modal-open'); document.body.style.overflow = ''; document.body.style.paddingRight = ''; this.modalInstance = null;}
}