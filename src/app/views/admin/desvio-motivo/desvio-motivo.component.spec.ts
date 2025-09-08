import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesvioMotivoComponent } from './desvio-motivo.component';

describe('DesvioMotivoComponent', () => {
  let component: DesvioMotivoComponent;
  let fixture: ComponentFixture<DesvioMotivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesvioMotivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesvioMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
