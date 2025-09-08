import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearingCuposComponent } from './clearing-cupos.component';

describe('ClearingCuposComponent', () => {
  let component: ClearingCuposComponent;
  let fixture: ComponentFixture<ClearingCuposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearingCuposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearingCuposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
