import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// V V V V V V V V V V V V V V V V V V V V V V V V
// THIS IS THE LINE TO FIX:
// We must import the class named 'AppComponent' from the file './app/app'.
import { AppComponent } from './app/app';
// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^
bootstrapApplication(AppComponent, appConfig) // <-- And use the correct name here
.catch((err) => console.error(err));