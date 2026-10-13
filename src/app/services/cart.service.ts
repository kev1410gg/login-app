import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<{ productId: number; qty: number }[]>([]);
  clear() { this.items.set([]); }
}