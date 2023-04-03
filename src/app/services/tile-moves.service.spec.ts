import { TestBed } from '@angular/core/testing';

import { TileMovesService } from './tile-moves.service';

describe('TileMovesService', () => {
  let service: TileMovesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileMovesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
