import { TestBed } from '@angular/core/testing';

import { AllcategoriesService } from './allcategories.service';

describe('AllcategoriesService', () => {
  let service: AllcategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllcategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
