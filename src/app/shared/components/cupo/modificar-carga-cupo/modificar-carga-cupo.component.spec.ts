import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCargaCupoComponent } from './modificar-carga-cupo.component';

describe('ModificarCargaCupoComponent', () => {
  let component: ModificarCargaCupoComponent;
  let fixture: ComponentFixture<ModificarCargaCupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarCargaCupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarCargaCupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
