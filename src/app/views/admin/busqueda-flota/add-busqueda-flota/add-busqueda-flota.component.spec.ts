import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusquedaFlotaComponent } from './add-busqueda-flota.component';

describe('AddBusquedaFlotaComponent', () => {
  let component: AddBusquedaFlotaComponent;
  let fixture: ComponentFixture<AddBusquedaFlotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusquedaFlotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusquedaFlotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
