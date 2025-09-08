import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FertilizantesAuthGuard implements CanActivate {
  public authToken;
  private isAuthenticated = true; // Set this value dynamically

  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const dateExpires = moment(expiresAt);
    const token = localStorage.getItem('token');
    var now = moment(new Date());

    if (token===null) {
      this.router.navigate(['/sessions/signin']);
      return false;
    }
    let rol: string = localStorage.getItem('rol');
    if ( rol == '15') {
      if (localStorage.getItem('currentUser')) {
        return true;
      }
    }
    this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
