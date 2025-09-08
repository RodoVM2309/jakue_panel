import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoDescargaComponent } from './estado-descarga.component';

describe('EstadoDescargaComponent', () => {
  let component: EstadoDescargaComponent;
  let fixture: ComponentFixture<EstadoDescargaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoDescargaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoDescargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
