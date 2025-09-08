import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaFlotaComponent } from './busqueda-flota.component';

describe('BusquedaFlotaComponent', () => {
  let component: BusquedaFlotaComponent;
  let fixture: ComponentFixture<BusquedaFlotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaFlotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaFlotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
