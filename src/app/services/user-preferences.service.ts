import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  getUserLanguage(): string {
    return localStorage.getItem('cliniclan');
  }

  setUserLanguage(lang: string) {
    localStorage['cliniclan'] = lang;
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  getUserImage(): string {
    return localStorage.getItem('userImage');
  }

  getItemsPerPage(): number {
    return 15;
  }
}
