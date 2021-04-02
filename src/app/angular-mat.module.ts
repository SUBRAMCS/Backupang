import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule,  DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/format-datepicker';
import { MatDialogModule } from '@angular/material';
import {MAT_DATE_LOCALE} from '@angular/material/core';

// Import the below module to disable animations
// import { NoopAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
	{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ]
})
export class AngularMatModule {}
