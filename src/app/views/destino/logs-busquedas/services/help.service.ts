import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private changePage = new BehaviorSubject<boolean>(false);
  public customChangePage = this.changePage.asObservable();

  constructor() { }

  public changePaginator(value:boolean): void {
    this.changePage.next(value);
  }

}
