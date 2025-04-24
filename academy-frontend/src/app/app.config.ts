import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core'; 
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideHttpClient(withFetch()),          
    provideAnimations(),                     
    importProvidersFrom(ReactiveFormsModule)
  ]
};