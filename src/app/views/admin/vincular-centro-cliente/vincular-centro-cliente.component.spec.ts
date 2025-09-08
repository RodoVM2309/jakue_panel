import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCentroClienteComponent } from './vincular-centro-cliente.component';

describe('VincularCentroClienteComponent', () => {
  let component: VincularCentroClienteComponent;
  let fixture: ComponentFixture<VincularCentroClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCentroClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCentroClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
