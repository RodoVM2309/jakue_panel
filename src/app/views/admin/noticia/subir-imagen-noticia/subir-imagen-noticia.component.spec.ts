import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirImagenNoticiaComponent } from './subir-imagen-noticia.component';

describe('SubirImagenNoticiaComponent', () => {
  let component: SubirImagenNoticiaComponent;
  let fixture: ComponentFixture<SubirImagenNoticiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirImagenNoticiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirImagenNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
