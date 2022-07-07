import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReuseSearchComponent } from './components/reuse-search/reuse-search.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomSearchComponent } from './components/reuse-search/custom-search/custom-search.component';


const material=[
  MatAutocompleteModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule
]

@NgModule({
  declarations: [
    SearchTermComponent,
    ReuseSearchComponent,
    CustomSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...material
  ],
  exports:[
    SearchTermComponent,
    ReuseSearchComponent
  ]
})
export class SharedModule { }
