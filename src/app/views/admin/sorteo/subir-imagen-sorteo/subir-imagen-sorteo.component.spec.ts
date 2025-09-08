import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirImagenSorteoComponent } from './subir-imagen-sorteo.component';

describe('SubirImagenSorteoComponent', () => {
  let component: SubirImagenSorteoComponent;
  let fixture: ComponentFixture<SubirImagenSorteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirImagenSorteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirImagenSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
