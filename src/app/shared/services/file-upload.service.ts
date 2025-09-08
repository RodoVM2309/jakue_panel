import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpResponse } from '@angular/common/http';
import { GlobalService } from '../models/global.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private globalService: GlobalService, private http: HttpClient, private sanitizer: DomSanitizer
  ) { }

  imagenUp(tipo: string, controlador: string, file: File): Observable<any> {
    var formData: any = new FormData();
    formData.append(tipo, file, file.name);
    return this.http.post(this.globalService.apiHost + controlador, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }

  getImagen(): any {
    let token: string = localStorage.getItem("token");
    let url = this.globalService.apiHost + "centro/imagen-down?r=" + token;
    return this.http.get(url, {
      responseType: 'blob'
    })
      .pipe(
        map((res: any) => {
          const urlCreator = window.URL;
          return this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(res));
        })
      );
  }





  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
