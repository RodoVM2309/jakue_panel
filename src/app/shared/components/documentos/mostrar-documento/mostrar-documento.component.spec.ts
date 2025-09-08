import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarDocumentoComponent } from './mostrar-documento.component';

describe('MostrarDocumentoComponent', () => {
  let component: MostrarDocumentoComponent;
  let fixture: ComponentFixture<MostrarDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
