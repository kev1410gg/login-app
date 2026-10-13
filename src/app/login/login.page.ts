import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonButton, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, IonContent, IonInput, IonButton],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  loading = false;

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { username, password } = this.form.getRawValue();

    try {
      await this.auth.login(username, password);
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e) {
      if (e instanceof Error && e.message === 'SIN_CONEXION') {
        await this.mostrar('Sin conexión a internet. Revisa tu red e intenta de nuevo.', 'warning');
      } else if (e instanceof HttpErrorResponse && [400, 401, 403, 404].includes(e.status)) {
        await this.mostrar('Usuario o contraseña inválidos', 'danger'); // alerta roja
      } else {
        await this.mostrar('Ocurrió un error inesperado', 'danger');
      }
    } finally {
      this.loading = false;
    }
  }

  private async mostrar(message: string, color: 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({ message, color, duration: 3000, position: 'top' });
    await toast.present();
  }
}