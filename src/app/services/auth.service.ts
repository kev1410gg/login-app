import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Network } from '@capacitor/network';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { CartService } from './cart.service';

export type Rol = 'Administrador' | 'Cliente' | 'Auditor';

export interface Sesion {
  userId: number;
  rol: Rol;
  nombre: string;
}

const API = 'https://backend-fastapi-twxr.onrender.com';

// Regla de negocio: IDs 1 y 2 = Administrador, ID 3 = Auditor, el resto = Cliente
function mapearRol(id: number): Rol {
  if (id === 1 || id === 2) return 'Administrador';
  if (id === 3) return 'Auditor';
  return 'Cliente';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cart = inject(CartService);

  sesion = signal<Sesion | null>(null);

  // ---------- US01 ----------
  async login(username: string, password: string): Promise<void> {
    // Escenario 3: cortar antes de consumir la API si no hay red
    const { connected } = await Network.getStatus();
    if (!connected) throw new Error('SIN_CONEXION');

    // Escenarios 1 y 2: un error de credenciales lo lanza HttpClient
    const res = await firstValueFrom(
      this.http.post<{ access_token: string; user_id: number }>(
        `${API}/auth/login`,
        { username, password }
      )
    );

    const userId = Number(res.user_id);
    const rol = mapearRol(userId);
    const nombre = username; // si el backend tiene un endpoint de usuario, aquí se cambia

    await SecureStorage.set('token', res.access_token);
    await SecureStorage.set('userId', String(userId));
    await SecureStorage.set('rol', rol);
    await SecureStorage.set('nombre', nombre);

    this.sesion.set({ userId, rol, nombre });
  }

  /** Restaura la sesión al abrir la app (la usa el guard) */
  async restaurar(): Promise<boolean> {
    if (this.sesion()) return true;
    const token = await SecureStorage.get('token');
    if (!token) return false;

    const userId = Number(await SecureStorage.get('userId'));
    const rol = (await SecureStorage.get('rol')) as Rol;
    const nombre = (await SecureStorage.get('nombre')) as string;
    this.sesion.set({ userId, rol, nombre });
    return true;
  }

  // ---------- US02 ----------
  async logout(): Promise<void> {
    await SecureStorage.clear();
    this.cart.clear();
    this.sesion.set(null);
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}