import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { App } from './app/app';
import 'zone.js';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
  ]
}).catch(err => console.error(err));
