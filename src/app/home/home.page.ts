import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Inicio</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="auth.logout()">Cerrar sesión</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      @if (auth.sesion(); as s) {
        <h2>Hola, {{ s.nombre }}</h2>
        <p>Rol: <strong>{{ s.rol }}</strong></p>
        @switch (s.rol) {
          @case ('Administrador') { <p>Vista de administración</p> }
          @case ('Auditor') { <p>Vista de auditoría</p> }
          @default { <p>Catálogo de productos</p> }
        }
      }
    </ion-content>
  `,
})
export class HomePage {
  auth = inject(AuthService);
}