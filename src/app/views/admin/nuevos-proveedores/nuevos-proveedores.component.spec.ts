import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevosProveedoresComponent } from './nuevos-proveedores.component';

describe('NuevosProveedoresComponent', () => {
  let component: NuevosProveedoresComponent;
  let fixture: ComponentFixture<NuevosProveedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevosProveedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevosProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
