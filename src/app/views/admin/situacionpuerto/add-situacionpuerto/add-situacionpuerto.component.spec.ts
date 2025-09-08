import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSituacionpuertoComponent } from './add-situacionpuerto.component';

describe('AddSituacionpuertoComponent', () => {
  let component: AddSituacionpuertoComponent;
  let fixture: ComponentFixture<AddSituacionpuertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSituacionpuertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSituacionpuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
