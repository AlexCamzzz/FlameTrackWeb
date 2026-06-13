import { Injectable, signal } from '@angular/core';

export interface VaultItem {
  id: string;
  name: string;
  value: string;
  label?: string; // e.g. "CLABE", "Account #", "Reference"
}

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  private readonly STORAGE_KEY = 'flametrack_vault_data';
  private readonly PIN_KEY = 'flametrack_vault_pin';

  items = signal<VaultItem[]>([]);
  isLocked = signal(true);
  hasPin = signal(false);

  constructor() {
    this.hasPin.set(!!localStorage.getItem(this.PIN_KEY));
  }

  setupPin(pin: string) {
    localStorage.setItem(this.PIN_KEY, pin);
    this.hasPin.set(true);
    this.isLocked.set(false);
    this.save();
  }

  unlock(pin: string): boolean {
    const savedPin = localStorage.getItem(this.PIN_KEY);
    if (savedPin === pin) {
      this.isLocked.set(false);
      this.load();
      return true;
    }
    return false;
  }

  lock() {
    this.isLocked.set(true);
    this.items.set([]);
  }

  private load() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        // In a real app, we would decrypt here using the PIN
        this.items.set(JSON.parse(data));
      } catch {
        this.items.set([]);
      }
    }
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  addItem(item: Omit<VaultItem, 'id'>) {
    const newItem = { ...item, id: crypto.randomUUID() };
    this.items.update(current => [...current, newItem]);
    this.save();
  }

  removeItem(id: string) {
    this.items.update(current => current.filter(i => i.id !== id));
    this.save();
  }

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.PIN_KEY);
    this.items.set([]);
    this.isLocked.set(true);
    this.hasPin.set(false);
  }
}
