import { TestBed } from '@angular/core/testing';

import { Adotante } from './adotante';

describe('Adotante', () => {
  let service: Adotante;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Adotante);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
