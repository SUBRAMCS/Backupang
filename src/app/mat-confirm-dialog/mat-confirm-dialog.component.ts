import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-mat-confirm-dialog',
  templateUrl: './mat-confirm-dialog.component.html',
  styleUrls: ['./mat-confirm-dialog.component.css']
})
export class MatConfirmDialogComponent implements OnInit {
  

  memberId: string;
  constructor(private dialogRef: MatDialogRef<MatConfirmDialogComponent>,@Inject(MAT_DIALOG_DATA) public data) { 
    
  }

  ngOnInit() {
   
  }

  save(){
    this.dialogRef.close(this.memberId);
  }
  
  close(){
    this.dialogRef.close(null);
  }

}
