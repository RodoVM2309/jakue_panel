import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanceTimeComponent } from './chance-time.component';

describe('ChanceTimeComponent', () => {
  let component: ChanceTimeComponent;
  let fixture: ComponentFixture<ChanceTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanceTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanceTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
