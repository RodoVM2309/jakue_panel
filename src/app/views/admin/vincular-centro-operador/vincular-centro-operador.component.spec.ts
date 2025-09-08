import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCentroOperadorComponent } from './vincular-centro-operador.component';

describe('VincularCentroOperadorComponent', () => {
  let component: VincularCentroOperadorComponent;
  let fixture: ComponentFixture<VincularCentroOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCentroOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCentroOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
