import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { WorkerListComponent } from './pages/worker-list/worker-list.component';
import { WorkerDetailComponent } from './pages/worker-detail/worker-detail.component';
import { WorkerFormComponent } from './pages/worker-form/worker-form.component';
import { WeekWorkListComponent } from './pages/week-work-list/week-work-list.component'; 
import { authGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login | AcademyNet StaffTracker'
  },
  {
    path: 'workers',
    component: WorkerListComponent,
    title: 'Workers List | AcademyNet StaffTracker',
    canActivate: [authGuard]
  },
  {
    path: 'workers/new',
    component: WorkerFormComponent,
    title: 'Add Worker | AcademyNet StaffTracker',
    canActivate: [authGuard]
  },
  {
    path: 'workers/edit/:enrollment',
    component: WorkerFormComponent,
    title: 'Edit Worker | AcademyNet StaffTracker',
    canActivate: [authGuard]
  },
  {
    path: 'workers/:enrollment', 
    component: WorkerDetailComponent,
    title: 'Worker Detail | AcademyNet StaffTracker',
    canActivate: [authGuard]
  },
   {
     path: 'weekworks', 
     component: WeekWorkListComponent,
     title: 'Week Works | AcademyNet StaffTracker',
     canActivate: [authGuard]
   },

  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/login' } 
];