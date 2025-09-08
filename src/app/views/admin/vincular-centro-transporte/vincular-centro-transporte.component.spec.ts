import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCentroTransporteComponent } from './vincular-centro-transporte.component';

describe('VincularCentroTransporteComponent', () => {
  let component: VincularCentroTransporteComponent;
  let fixture: ComponentFixture<VincularCentroTransporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCentroTransporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCentroTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
