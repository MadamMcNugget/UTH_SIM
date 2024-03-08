import { TestBed } from '@angular/core/testing';

import { PokerEvaluatorService } from './poker-evaluator.service';

describe('PokerEvaluatorService', () => {
  let service: PokerEvaluatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokerEvaluatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
