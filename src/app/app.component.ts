import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app><ion-router-outlet /></ion-app>`,
})
export class AppComponent {
  private router = inject(Router);

  constructor() {
    App.addListener('backButton', () => {
      const url = this.router.url;
      // En login o en la pantalla principal, "Atrás" cierra la app
      if (url.startsWith('/login') || url.startsWith('/home')) {
        App.exitApp();
      }
    });
  }
}