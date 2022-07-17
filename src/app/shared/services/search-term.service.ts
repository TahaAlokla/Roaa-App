import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchTermService {
  private readonly api: string = 'http://www.omdbapi.com/?apikey=e8067b53'
  constructor(private http: HttpClient) { }
  searchTermApi(term: string): Observable<any> {
    return this.http.get(`${this.api}` + '&s=' + term);
  }
}
