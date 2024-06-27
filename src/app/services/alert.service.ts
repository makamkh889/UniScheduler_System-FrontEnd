import { Injectable } from '@angular/core';
// To appear messages to users
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  showWarningAlert(message: string) {
    Swal.fire({
      title: 'Warning!',
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK',
    });
  }

  showInfoAlert(message: string) {
    Swal.fire({
      title: 'Info',
      text: message,
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }
}
