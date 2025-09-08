import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleZonaComponent } from './detalle-zona.component';

describe('DetalleZonaComponent', () => {
  let component: DetalleZonaComponent;
  let fixture: ComponentFixture<DetalleZonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleZonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
