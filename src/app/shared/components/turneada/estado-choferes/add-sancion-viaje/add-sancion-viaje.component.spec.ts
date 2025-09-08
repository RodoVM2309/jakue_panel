import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSancionViajeComponent } from './add-sancion-viaje.component';

describe('AddSancionViajeComponent', () => {
  let component: AddSancionViajeComponent;
  let fixture: ComponentFixture<AddSancionViajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSancionViajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSancionViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
