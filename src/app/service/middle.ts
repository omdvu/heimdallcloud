import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Middle {
  public api = "https://cloudbackend.omprajapati.in";
  constructor(private http:HttpClient){}

  getToken(){
    return sessionStorage.getItem('token');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.api}/login`, credentials, { withCredentials: true });
  }
  logout(): Observable<any> {
    return this.http.post(`${this.api}/logout`, { withCredentials: true });
  }
  getFiles(dir?: string): Observable<any> {
    console.log("requested path is", dir)
    return this.http.get(`${this.api}/filelogs?token=${this.getToken()}`, {
      params: { path: dir || '' },
      withCredentials: true
    });
  }
  uploadFileWithProgress(formData: FormData) {
    const req = new HttpRequest('POST', `${this.api}/upload?token=${this.getToken()}`, formData, {
      reportProgress: true,
      withCredentials: true
    });
    return this.http.request(req);
  }
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.api}/upload?token=${this.getToken()}`, formData, { withCredentials: true });
  }

  createDir(token:any,dir:any,formdata:any): Observable <any>{
    return this.http.post(`${this.api}/createdir?token=${token}&path=${dir}`,{formdata:formdata},{withCredentials:true});
  }
}
