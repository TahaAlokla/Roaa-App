import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent, map, mapTo, Observable, startWith } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,


  OnChanges,

  Optional,
  Self,
  SimpleChanges,
} from "@angular/core"
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms"
import { coerceNumberProperty } from "@angular/cdk/coercion"

import { debounceTime } from "rxjs/operators"
export interface Identifiable {
  id: string | number
  label: string
}
function isAutocompleteOption(value: Identifiable): boolean {
  if (!value || typeof value === "string") return false
  return value.id > 0
}
function containsIdValidation(control: AbstractControl): ValidationErrors | null {
  return isAutocompleteOption(control.value) ? null : { required: true }
}
@Component({
  selector: 'app-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchTermComponent implements OnInit {
  // 
  selectedOption(){
    
  }
  @Input() value!: string;
  click$!: Observable<string>;
  // 
  constructor(private host: ElementRef) { }
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  get element() { return this.host.nativeElement; }
  ngOnInit() {
    this.click$ = fromEvent(this.element, 'click').pipe(mapTo(this.value));
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


}
