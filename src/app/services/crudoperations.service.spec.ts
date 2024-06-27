import { TestBed } from '@angular/core/testing';

import { CRUDOperationsService } from './crudoperations.service';

describe('CRUDOperationsService', () => {
  let service: CRUDOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CRUDOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
