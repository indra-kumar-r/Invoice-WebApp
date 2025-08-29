import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // Local Storage
  private setLocalStorageData(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private getLocalStorageData<T>(key: string): T {
    const item = localStorage.getItem(key);
    if (item === null || item === 'undefined') {
      return '' as string as T;
    }
    return JSON.parse(item as string) as T;
  }

  // Session Storage

  private setSessionStorageData(key: string, value: unknown) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  private getSessionStorageData<T>(key: string): T {
    const item = sessionStorage.getItem(key);
    if (item === null || item === 'undefined') {
      return '' as string as T;
    }
    return JSON.parse(item as string) as T;
  }

  // Common storage methods

  removeLocalStorageData(key: string) {
    localStorage.removeItem(key);
  }

  removeSessionStorageData(key: string) {
    sessionStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
    sessionStorage.clear();
  }

  // Auth

  setAuth(data: unknown) {
    this.setSessionStorageData('auth', data);
  }

  getAuth() {
    return this.getSessionStorageData('auth');
  }
}
