import { TestBed } from '@angular/core/testing';

import { ApiDoctorService } from './api-doctor.service';

describe('ApiDoctorService', () => {
  let service: ApiDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
