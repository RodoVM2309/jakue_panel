import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionCentroComponent } from './configuracion-centro.component';

describe('ConfiguracionCentroComponent', () => {
  let component: ConfiguracionCentroComponent;
  let fixture: ComponentFixture<ConfiguracionCentroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionCentroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
