import { TestBed } from '@angular/core/testing';

import { AllProdutcsService } from './all-produtcs.service';

describe('AllProdutcsService', () => {
  let service: AllProdutcsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllProdutcsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
