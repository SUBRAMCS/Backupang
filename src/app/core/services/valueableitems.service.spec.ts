import { TestBed } from '@angular/core/testing';

import { ValueItemService } from './valueableitems.service';

describe('ValueItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValueItemService = TestBed.get(ValueItemService);
    expect(service).toBeTruthy();
  });
});
