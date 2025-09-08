import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarViajeComponent } from './asignar-viaje.component';

describe('AsignarViajeComponent', () => {
  let component: AsignarViajeComponent;
  let fixture: ComponentFixture<AsignarViajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarViajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
