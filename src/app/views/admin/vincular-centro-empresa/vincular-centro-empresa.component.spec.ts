import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCentroEmpresaComponent } from './vincular-centro-empresa.component';

describe('VincularCentroEmpresaComponent', () => {
  let component: VincularCentroEmpresaComponent;
  let fixture: ComponentFixture<VincularCentroEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCentroEmpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCentroEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
