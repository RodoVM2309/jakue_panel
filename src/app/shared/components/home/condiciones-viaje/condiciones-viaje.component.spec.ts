import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionesViajeComponent } from './condiciones-viaje.component';

describe('CondicionesViajeComponent', () => {
  let component: CondicionesViajeComponent;
  let fixture: ComponentFixture<CondicionesViajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondicionesViajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionesViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
