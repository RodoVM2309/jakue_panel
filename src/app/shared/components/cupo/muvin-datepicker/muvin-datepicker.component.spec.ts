import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuvinDatepickerComponent } from './muvin-datepicker.component';

describe('MuvinDatepickerComponent', () => {
  let component: MuvinDatepickerComponent;
  let fixture: ComponentFixture<MuvinDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuvinDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuvinDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
