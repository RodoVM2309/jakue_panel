import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DestinoAuthGuard implements CanActivate {
  public authToken;
  private isAuthenticated = true; // Set this value dynamically

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const dateExpires = moment(expiresAt);
    const token = localStorage.getItem('token');
    //console.log('Fecha Localstore:',date);
    var now = moment(new Date());
    
   /*  if (dateExpires < now) {
      this.router.navigate(['/sessions/signin']);
      return false;
    } */
    if (token===null) {
      this.router.navigate(['/sessions/signin']);
      return false;
    }   
    let rol: string = localStorage.getItem('rol');
    if ( rol == '7' || rol == '3') {
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
