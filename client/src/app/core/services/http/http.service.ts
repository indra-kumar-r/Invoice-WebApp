import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  baseUrl = 'http://localhost:4750';

  private options = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(this.baseUrl + url, this.options);
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.httpClient.post<T>(this.baseUrl + url, body, this.options);
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.httpClient.put<T>(this.baseUrl + url, body, this.options);
  }

  delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(this.baseUrl + url, this.options);
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.httpClient.patch<T>(this.baseUrl + url, body, this.options);
  }
}
