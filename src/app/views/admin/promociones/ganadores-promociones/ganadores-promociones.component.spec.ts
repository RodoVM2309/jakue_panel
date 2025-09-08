import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadoresPromocionesComponent } from './ganadores-promociones.component';

describe('GanadoresProductosComponent', () => {
  let component: GanadoresPromocionesComponent;
  let fixture: ComponentFixture<GanadoresPromocionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanadoresPromocionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanadoresPromocionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
