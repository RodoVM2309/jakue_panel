import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import * as moment from 'moment';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  public authToken;
  private isAuthenticated = true; // Set this value dynamically

  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const dateExpires = moment(expiresAt);
    const token = localStorage.getItem('token');
    //console.log('Fecha Localstore:',date);
    var now = moment(new Date());
    
    /* if (dateExpires < now) {
      this.router.navigate(['/sessions/signin']);
      return false;
    } */
    if (token===null) {
      this.router.navigate(['/sessions/signin']);
      return false;
    } 
    let rol: string = localStorage.getItem('rol');
    if ( rol == '1' || rol == '12') {
     // console.log('Expira al:' + expiresAt);
      if (localStorage.getItem('currentUser')) {
        return true;
      }
    }
    this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url } });
    return false;
    /* if (this.isAuthenticated) {
      return true
    }
    this.router.navigate(['/sessions/signin']);
    return false; */
  }
}
