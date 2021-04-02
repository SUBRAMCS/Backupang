import { NativeDateAdapter } from '@angular/material';
import { MatDateFormats } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
    //  console.log("before day is "+day);
      day = +day < 10 ? '0' + day : day;
     // console.log("after day is "+day);
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
  //    console.log("date.toDateString() a ",`${day}/${month}/${year}`);
      return `${day}/${month}/${year}`;
    }
   // console.log("date.toDateString() 17",date.toDateString());
    return date.toDateString();
  }
}
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
