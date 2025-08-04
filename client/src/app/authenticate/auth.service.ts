import { computed, Injectable, signal } from '@angular/core';
import { CacheService } from '../general/cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CacheService {
  private accessToken = signal('');
  isLoggedIn = computed(() => this.accessToken() !== '');
  
}
