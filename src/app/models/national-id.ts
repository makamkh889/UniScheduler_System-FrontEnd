import { Validators } from '@angular/forms';

export interface NationalID {
    nationalId: string;
}

export const NationalIDValidators = {
    nationalId: ['', Validators.compose([
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14)
    ])]
};