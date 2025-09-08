import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluarComponent } from './evaluar.component';

describe('EvaluarComponent', () => {
  let component: EvaluarComponent;
  let fixture: ComponentFixture<EvaluarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
