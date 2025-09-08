import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import * as moment from 'moment';

@Injectable()
export class AuthGuard implements CanActivate {
  public authToken;
  private isAuthenticated = true; // Set this value dynamically

  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const dateExpires = moment(expiresAt);
    const token = localStorage.getItem('token');
    
    
    var now = moment(new Date());

    /* if (dateExpires < now) {
      this.router.navigate(['/sessions/signin']);
      return false;
    } */
    if (token===null) {
      this.router.navigate(['/sessions/signin']);
      return false;
    }

    if (localStorage.getItem('currentUser') ) {
      return true;          
    }

    let acepto_tyc = parseInt(localStorage.getItem('accept_tyc'));
            
    if( acepto_tyc == 0 ){        
      this.router.navigateByUrl('/sessions/signin');
      return false;
    }

  this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url }});
  return false;
  }
}
