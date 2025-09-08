import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirImagenOrigenComponent } from './subir-imagen-origen.component';

describe('SubirImagenOrigenComponent', () => {
  let component: SubirImagenOrigenComponent;
  let fixture: ComponentFixture<SubirImagenOrigenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirImagenOrigenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirImagenOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
