import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEstadoDescargaComponent } from './add-estado-descarga.component';

describe('AddEstadoDescargaComponent', () => {
  let component: AddEstadoDescargaComponent;
  let fixture: ComponentFixture<AddEstadoDescargaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEstadoDescargaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEstadoDescargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
