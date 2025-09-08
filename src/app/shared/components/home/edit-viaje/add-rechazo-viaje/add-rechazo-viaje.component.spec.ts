import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRechazoViajeComponent } from './add-rechazo-viaje.component';

describe('AddRechazoViajeComponent', () => {
  let component: AddRechazoViajeComponent;
  let fixture: ComponentFixture<AddRechazoViajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRechazoViajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRechazoViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
