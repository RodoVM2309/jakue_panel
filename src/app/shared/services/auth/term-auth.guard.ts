import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class TermAuthGuard implements CanActivate {
  public authToken;
  private isAuthenticated = true; // Set this value dynamically

  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    const token = localStorage.getItem('token');
    
    if (token===null) {
      this.router.navigate(['/sessions/signin']);
      return false;
    }
    
    let acepto_tyc = parseInt(localStorage.getItem('accept_tyc'));

    if( acepto_tyc == 1 ){              
      return true;
    }

  this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url }});
  return false;
  }
}
