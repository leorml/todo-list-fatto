import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpPersonService {

  constructor(private http: HttpClient) { }

  private urlBase = "http://localhost:3000";
  private header = { withCredentials: true };

  get(url: string = "", options: any = this.header): Observable<Object> {
    let formatURL = url.startsWith("/") ? url.substring(1) : url;
   
    return this.http.get(`${this.urlBase}/${formatURL}`, options);
  }

  post(url: string = "", parameter: any, options: any = this.header): Observable<Object> {
    let formatURL = url.startsWith("/") ? url.substring(1) : url;
    
    return this.http.post(`${this.urlBase}/${formatURL}`, parameter, options);
  }

  put(url: string = "", parameter: any, options: any = this.header): Observable<Object> {
    let formatURL = url.startsWith("/") ? url.substring(1) : url;
   
    return this.http.put(`${this.urlBase}/${formatURL}`, parameter, options);
  }

  delete(url: string = "", options: any = this.header): Observable<Object> {
    let formatURL = url.startsWith("/") ? url.substring(1) : url;
   
    return this.http.delete(`${this.urlBase}/${formatURL}`, options);
  }
}
