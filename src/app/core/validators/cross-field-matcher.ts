import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class CrossFieldMatcher implements ErrorStateMatcher{
    isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
        return control.dirty && form.invalid;
    }
}
