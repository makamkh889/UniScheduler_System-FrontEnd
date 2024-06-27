import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  validateNationalId(NationalId: string): boolean {
    const isNumeric = /^\d+$/.test(NationalId);
    return NationalId.length === 14 && isNumeric;
  }

  emailDomainValidator(email: string) {
    if (email.endsWith('@compit.aun.edu.eg') && email.length > 18) {
      return true;
    }
    return false;
  }


  validateTime(timeInput: string, dayInput: string) {
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    // Check if timeInput matches the time format
    if (timeRegex.test(timeInput)) {
      dayInput.substring(0, 3);
      return `${timeInput} ${dayInput}`;
    }

    return "0";
  }


}
