import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, ValidationErrors, Validator, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  static age_lowerLimit: number = 18;
  static age_upperLimit: number = 100;
  static passwordFieldCombinations: any = [["password", "cnfrmPassword"], ["rpwd", "cpwd"]];
  static year : number = 1000 * 60 * 60 * 24 * 365 ;

  constructor() {
   }

   nameValidation : ValidatorFn  = (control : AbstractControl) : ValidationErrors | null => {

  
    let error : ValidationErrors = null;
    const nameVal = control.value;
    if(null!=nameVal && nameVal.length){
      let lenAps=nameVal.split('\'').length-1;
      let lenHyp=nameVal.split('-').length-1;
      let lenSpace=nameVal.split(' ').length-1;
      let dotLen=nameVal.split('.').length-1;
      if(nameVal.length===(lenAps+lenHyp+lenSpace+dotLen))
        error = {'onlySpecialChar': true };
      else if(dotLen!==0 && (dotLen>1 || nameVal.indexOf('.')!==nameVal.length-1))
        error = {'fullStopValidation': true }
	//  else if(nameVal.trim().indexOf("  ")!=-1)
//		  error = {'multiplespaces': true }
    }
    return error;
  }

  ageEligibility : ValidatorFn  = (control : AbstractControl) : ValidationErrors | null => {

   const dobVal = control.value;
   console.log(dobVal);
   
  let diff = (new Date().getFullYear()-new Date(dobVal).getFullYear());
   let error : ValidationErrors = null;

   
   if(diff>=ValidatorService.age_lowerLimit && diff < ValidatorService.age_upperLimit)
   {
       if(diff==ValidatorService.age_lowerLimit && new Date(dobVal).getMonth()<= new Date().getMonth())
       {
            if(diff==ValidatorService.age_lowerLimit && new Date(dobVal).getDate() > new Date().getDate())
            {
              error = { 'underage': true };
              return error;
            }
       }
       else if(diff==ValidatorService.age_lowerLimit)
       {
           error = { 'underage': true };
           return error;
       }
   }
   else if(diff < ValidatorService.age_lowerLimit)
   {
      error = { 'underage': true };
      return error;
   }   
 

   if(diff<=ValidatorService.age_upperLimit && diff>ValidatorService.age_lowerLimit)
   {
       if(diff==ValidatorService.age_upperLimit && new Date(dobVal).getMonth()>= new Date().getMonth())
       {
            if(diff==ValidatorService.age_upperLimit && new Date(dobVal).getDate() < new Date().getDate())
            {
              error = { 'overage': true };
              return error;
            }
       }
       else if(diff==ValidatorService.age_upperLimit)
       {
          error = { 'overage': true };
          return error;
       }
       

   }
   else if(diff>ValidatorService.age_upperLimit)
   {
       error = { 'overage': true };
       return error;
   } 
  


   return error;
   
  }

  matchValue : ValidatorFn = (control: FormGroup)  : ValidationErrors | null => {
    let pwd = null;
    let cnfrmpwd = null;
    let elementCombnFound = false;
    let error: ValidationErrors = null;
    ValidatorService.passwordFieldCombinations.forEach(element => {
      pwd = control.get(element[0]);
      cnfrmpwd = control.get(element[1]);
      if(pwd && cnfrmpwd && pwd.value !== cnfrmpwd.value) {
        error = { 'pwdMatch': false } ;
      } 
    });
    return error;
  }
}
