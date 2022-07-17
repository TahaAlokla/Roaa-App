import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
const API_KEY = "e8067b53"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  serchMovies(event:string){
    console.log(event);

  }
  // Observable<any[]
  get callAPI(){
    //
    return (term: string) =>this.http.get('http://www.omdbapi.com/?apikey=' + API_KEY + '&s=' + term);


  }

}
