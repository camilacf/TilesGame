import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitModalComponent } from './init-modal.component';

describe('InitModalComponent', () => {
  let component: InitModalComponent;
  let fixture: ComponentFixture<InitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
