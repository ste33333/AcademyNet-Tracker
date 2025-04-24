import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkerService } from '../../services/worker.service';
import { CreateWorkerDto, UpdateWorkerDto } from '../../models/worker-input.model';
import { WorkerDetailDto } from '../../models/worker.model';
import { catchError, finalize, of, tap, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './worker-form.component.html',
  styleUrls: ['./worker-form.component.css']
})
export class WorkerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workerService = inject(WorkerService);
  private zone = inject(NgZone);

  workerForm!: FormGroup;
  isEditMode = false;
  enrollmentId: string | null = null;
  pageTitle = 'Worker Form';
  isLoading = false; // Flag per caricamento dati E salvataggio/update
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.workerForm = this.fb.group({
      enrollment: ['', [Validators.required, Validators.pattern('^[A-Z]\\d{3}$')]],
      fullName: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      age: [null, [Validators.min(16), Validators.max(100)]],
      address: [''],
      city: [''],
      province: [''],
      cap: ['', [Validators.pattern('^\\d{5}$')]],
      phone: ['']
    });
  }

  checkEditMode(): void {
    this.route.paramMap.subscribe(params => {
      this.enrollmentId = params.get('enrollment');
      if (this.enrollmentId) {
        this.isEditMode = true;
        this.pageTitle = `Edit Worker (${this.enrollmentId})`;
        this.workerForm.get('enrollment')?.disable(); 
        this.loadWorkerDataForEdit(this.enrollmentId); 
      } else {
        this.isEditMode = false;
        this.pageTitle = 'Add New Worker';
        this.workerForm.get('enrollment')?.enable(); 
      }
    });
  }

  // --- LOGICA REALE per Caricare Dati in Edit Mode ---
  loadWorkerDataForEdit(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    console.log(`Loading data for worker ${id} to edit...`);

    this.workerService.getWorkerDetail(id).pipe(
      tap(workerData => console.log('Received worker data for edit:', workerData)),
      catchError((error: any): Observable<null> => { 
         console.error('Error loading worker for edit:', error);
         this.zone.run(() => {
             this.errorMessage = error.message || `Error loading worker data: Not Found or other error.`;
         });
         this.router.navigate(['/workers']); 
         return of(null);
      }),
      finalize(() => {
         this.zone.run(() => { this.isLoading = false; });
      })
    ).subscribe(workerData => {
       if (workerData) {
           this.zone.run(() => {
              this.workerForm.patchValue({
                  fullName: workerData.fullName,
                  role: workerData.role,
                  department: workerData.department,
                  age: workerData.age,
                  address: workerData.address,
                  city: workerData.city,
                  province: workerData.province,
                  cap: workerData.cap,
                  phone: workerData.phone
              });
           });
       }
    });
  }

  onSubmit(): void {
    if (this.workerForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      this.workerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    let operation$: Observable<any>;

    if (this.isEditMode && this.enrollmentId) {
      // Prendi solo i valori dei campi abilitati per UpdateWorkerDto
      const updateData: UpdateWorkerDto = this.workerForm.value;
      console.log(`Attempting to update worker: ${this.enrollmentId}`);
      operation$ = this.workerService.updateWorker(this.enrollmentId, updateData);

    } else {
      // Prendi tutti i valori, incluso enrollment (che è abilitato) per CreateWorkerDto
      const createData: CreateWorkerDto = this.workerForm.getRawValue();
      console.log(`Attempting to create worker: ${createData.enrollment}`);
      operation$ = this.workerService.createWorker(createData);
    }
    
    operation$.pipe(
      catchError((error: any): Observable<null> => {
         console.error('Error saving/updating worker:', error);
         let specificError = error.message || 'Operation failed.';
         if (error.message && error.message.includes('(409)') && !this.isEditMode) {
             specificError = `Enrollment ${this.workerForm.getRawValue().enrollment} already exists.`;
             this.zone.run(() => { this.f['enrollment'].setErrors({ 'conflict': true }); });
         }
         this.zone.run(() => { this.errorMessage = specificError; });
         return of(null); 
      }),
      finalize(() => {
         this.zone.run(() => { this.isLoading = false; }); 
      })
    ).subscribe(result => {
       this.zone.run(() => {
            if (this.errorMessage === null) { 
                const workerName = this.workerForm.getRawValue().fullName;
                this.successMessage = `Worker ${workerName} ${this.isEditMode ? 'updated' : 'created'} successfully!`;
                console.log(`Worker ${this.isEditMode ? 'updated' : 'created'}`);
                setTimeout(() => this.router.navigate(['/workers']), 1500);
           }
       });
    });
  }

  get f() { return this.workerForm.controls; }
}