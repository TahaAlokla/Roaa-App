import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SearchTermComponent } from './components/search-term/search-term.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
const material=[
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatFormFieldModule,
  MatOptionModule,
  MatIconModule,
]

@NgModule({
  declarations: [
    SearchTermComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...material
  ],
  exports:[
    SearchTermComponent
  ]
})
export class SharedModule { }
