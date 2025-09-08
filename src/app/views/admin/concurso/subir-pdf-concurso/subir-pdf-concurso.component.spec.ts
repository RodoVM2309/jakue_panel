import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirPdfConcursoComponent } from './subir-pdf-concurso.component';

describe('SubirPdfConcursoComponent', () => {
  let component: SubirPdfConcursoComponent;
  let fixture: ComponentFixture<SubirPdfConcursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirPdfConcursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirPdfConcursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
