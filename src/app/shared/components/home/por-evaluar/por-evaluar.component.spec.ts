import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorEvaluarComponent } from './por-evaluar.component';

describe('PorEvaluarComponent', () => {
  let component: PorEvaluarComponent;
  let fixture: ComponentFixture<PorEvaluarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorEvaluarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorEvaluarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
