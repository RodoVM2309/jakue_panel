import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmsComponent } from './add-sms.component';

describe('AddSmsComponent', () => {
  let component: AddSmsComponent;
  let fixture: ComponentFixture<AddSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
