import { Component,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  Optional,
  Self,
  SimpleChanges,
  Type, } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

function isAutocompleteOption(value: Identifiable): boolean {
  if (!value || typeof value === 'string') return false;
  return value.id > 0;
}

function containsIdValidation(control: AbstractControl): ValidationErrors {
  return isAutocompleteOption(control.value) ? Type : { required: true };
}

import { Identifiable } from '../../../../core/interface/input-outocomplete.model';


@Component({
  selector: 'app-custom-search',
  templateUrl: './custom-search.component.html',
  styleUrls: ['./custom-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CustomSearchComponent implements OnInit,
 ControlValueAccessor,
 OnChanges {
  @Input() placeholder = 'Article\'s Name';
  @Input()
  options!: Identifiable[];
  searchCtrl = new FormControl('', this.validators);

  // filteredMovies!: any[];
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  noResults = false;
  @Input()
  set lengthToTriggerSearch(value: number) {
    this.minLengthTerm = coerceNumberProperty(value, 0);
  }
  // @Output()
  // selectedMovie: any;


  constructor(
    @Optional() @Self() private controlDir: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
   }

   ngOnInit() {
    if (this.controlDir) {
      // Set validators for the outer ngControl equals to the inner
      const control = this.controlDir.control;
      const validators = control?.validator
        ? [control?.validator, this.searchCtrl.validator]
        : this.searchCtrl.validator;
      control?.setValidators(this.validators);
      // Update outer ngControl status
      control?.updateValueAndValidity({ emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      if (this.isLoading) {
        this.isLoading = false;

        if (!changes['options'].firstChange && !changes['options'].currentValue.length) {
          this.noResults = true;
        } else {
          this.noResults = false;
        }
      }
    }
  }

  /**
   * Allows Angular to update the inputControl.
   * Update the model and changes needed for the view here.
   */
  writeValue(obj: any): void {
    obj && this.searchCtrl.setValue(obj);
  }

  /**
   * Allows Angular to register a function to call when the inputControl changes.
   */
  registerOnChange(fn: any): void {
    // Pass the value to the outer ngControl if it has an id otherwise pass null
    this.searchCtrl.valueChanges.pipe(debounceTime(300)).subscribe({
      next: value => {
        if (typeof value === 'string') {
          if (this.isMinLength(value)) {
            this.isLoading = true;
            /**
             * Fire change detection to display the searching status option
             */
            this.changeDetectorRef.detectChanges();
            fn(value.toUpperCase());
          } else {
            this.isLoading = false;
            this.noResults = false;

            fn(null);
          }
        } else {
          fn(value);
        }
      },
    });
  }

  /**
   * Allows Angular to register a function to call when the input has been touched.
   * Save the function as a property to call later here.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Allows Angular to disable the input.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.searchCtrl.disable() : this.searchCtrl.enable();
  }

  /**
   * Function to call when the input is touched.
   */
  onTouched() {}

  /**
   * Method linked to the mat-autocomplete `[displayWith]` input.
   * This is how result name is printed in the input box.
   */
  displayFn(result: Identifiable): string | undefined {
    return result ? result.label : undefined;
  }

  isMinLength(value: string) {
    return value.length >= this.minLengthTerm;
  }

  private get validators(): ValidatorFn[] {
    return [Validators.required, containsIdValidation];
  }

}
