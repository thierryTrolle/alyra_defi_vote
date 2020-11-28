import { TestBed } from '@angular/core/testing';

import { Votingweb3Service } from './votingweb3.service';

describe('Votingweb3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Votingweb3Service = TestBed.get(Votingweb3Service);
    expect(service).toBeTruthy();
  });
});
