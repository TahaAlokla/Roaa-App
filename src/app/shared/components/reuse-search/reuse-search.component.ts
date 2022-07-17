import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import {
  MatAutocompleteSelectedEvent,
  _MatAutocompleteBase,
} from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';

const API_KEY = 'e8067b53';

@Component({
  selector: 'app-reuse-search',
  templateUrl: './reuse-search.component.html',
  styleUrls: ['./reuse-search.component.scss'],
})
export class ReuseSearchComponent implements OnInit {
  searchMoviesCtrl = new FormControl();
  //
  @Input() autoCompleteFn: ((term: string) => Observable<any[]>) | null = null;
  @Input()
  // id , name : interface
  filteredMovies!: any | any[];
  // filteredMovies!: any[];
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  @Output()
  selectedMovie = new EventEmitter<string>();
  // selectedMovie: any = "";
  // create service from api
  constructor(private http: HttpClient) {}

  onSelected(event: MatAutocompleteSelectedEvent) {
    // imdbID
    console.log(event.option.value);
    // console.log(event.source);
    console.log(this.selectedMovie);
    this.selectedMovie.emit(event.option.value);
    // id : emit event
  }

  displayWith(value: any) {
    return value?.Title;
  }

  clearSelection() {
    // clear filter and input filed and emit value [ clear new value]
    // this.selectedMovie=[];
    this.filteredMovies = [];
  }

  ngOnInit() {
    this.searchMoviesCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        // tap(() => {
        //   this.errorMsg = "";
        //   // this.filteredMovies ;
        //   this.isLoading = true;
        // }),
        // catch error add
        switchMap((value) => {
          if (this.autoCompleteFn) {
            return this.autoCompleteFn(value) || of([]);
          } else {
            return of([]);
          }

          // .pipe(
          //   finalize(() => {
          //     this.isLoading = false
          //   }),
          // )
        })
        // handling error null
      )
      .subscribe((data: any) => {
        if (data['Search'] == undefined) {
          this.errorMsg = data['Error'];
          // this.filteredMovies;
        } else {
          this.errorMsg = '';
          this.filteredMovies = data['Search'];
        }
        console.log(this.filteredMovies);
      });
  }
}
