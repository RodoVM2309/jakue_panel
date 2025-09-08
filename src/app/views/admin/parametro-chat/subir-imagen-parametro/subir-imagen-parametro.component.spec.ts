import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirImagenParametroComponent } from './subir-imagen-parametro.component';

describe('SubirImagenParametroComponent', () => {
  let component: SubirImagenParametroComponent;
  let fixture: ComponentFixture<SubirImagenParametroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirImagenParametroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirImagenParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
