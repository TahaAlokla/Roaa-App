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
  catchError,
} from 'rxjs/operators';
import {
  MatAutocompleteSelectedEvent,
  _MatAutocompleteBase,
} from '@angular/material/autocomplete';
import { empty, Observable, of } from 'rxjs';

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

  constructor() { }

  onSelected(event: MatAutocompleteSelectedEvent) {
    // imdbID
    console.log(event.option.value.imdbID);
    // console.log(event.source);
    console.log(this.selectedMovie);
    // this.searchMoviesCtrl.setValue('')
    this.selectedMovie.emit(event.option.value.imdbID);
    // id : emit event
  }

  displayWith(value: any) {
    console.log(value?.Title);
    return value?.Title;
  }

  clearSelection() {
    // clear filter and input filed and emit value [ clear new value]
    // this.selectedMovie=[];
    this.searchMoviesCtrl.setValue('');
    this.filteredMovies = [];
  }

  ngOnInit() {
    this.searchMoviesCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        filter((res) => {
          if ( res.length <= this.minLengthTerm) {
            // * Not Working
          console.log("test inside use case less 3 char after search");
            this.filteredMovies = [];
          }
          return res !== '' || res.length >= this.minLengthTerm;
        }),

        switchMap((value) => {
          if (this.autoCompleteFn) {
            return this.autoCompleteFn(value) || of([]);
          } else {
            return of([]);
          }
        })  ,tap( (data:any) =>{
          // console.log(data);
          // this.filteredMovies = data['Search'];
          // console.log(this.filteredMovies);
          // if (data['Error']) {
          //   console.log("not found movies ");
          //   // this.errorMsg = data['Error'];
          //   this.errorMsg="not found movies"
          // }

        })
        // handling error null
        , catchError(error => {
          console.log(error);
          // Do something with error,
          return empty()
        }),

      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.filteredMovies = data['Search'];
          console.log(this.filteredMovies);

          if (data['Error']) {
            console.log("not found movies ");
            // this.errorMsg = data['Error'];
            this.errorMsg="not found movies"
          }else{
            // this.errorMsg = '';
            // this.filteredMovies = data['Search'];
            // console.log(this.filteredMovies);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
