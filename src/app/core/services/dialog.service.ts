import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatConfirmDialogComponent } from 'src/app/mat-confirm-dialog/mat-confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(formname){
   return this.dialog.open(MatConfirmDialogComponent,{
      width: '600px',
      panelClass:'confirm-dialog-container',
      disableClose: true,
      data: {
        name: formname
      }

    });
  }

  openNomineeList(formname,nomineeLists,nomineeKeyList){
    return this.dialog.open(MatConfirmDialogComponent,{
      width: '600px',
      panelClass:'confirm-dialog-container',
      disableClose: true,
      data: {
        name: formname,
        nomineeList: nomineeLists,
        familyMapKeysLs: nomineeKeyList
      }

    });
  }

}
