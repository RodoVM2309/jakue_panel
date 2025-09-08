import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapaRutaComponent } from './add-mapa-ruta.component';

describe('AddMapaRutaComponent', () => {
  let component: AddMapaRutaComponent;
  let fixture: ComponentFixture<AddMapaRutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapaRutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapaRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
