import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Pipe({
  name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private auth: AuthService, // our service that provides us with the authorization token
  ) {}

  async transform(src: string): Promise<string> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    try {
      const imageBlob = await this.http.get(src, {headers, responseType: 'blob'}).toPromise();    
      const reader = new FileReader();      
      return new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageBlob);
      });
    } catch {
      return 'assets/images/fallback.png';
    }
  }
  

}
