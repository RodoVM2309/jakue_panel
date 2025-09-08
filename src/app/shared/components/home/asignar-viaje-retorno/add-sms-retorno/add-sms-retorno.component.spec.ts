import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmsRetornoComponent } from './add-sms-retorno.component';

describe('AddSmsRetornoComponent', () => {
  let component: AddSmsRetornoComponent;
  let fixture: ComponentFixture<AddSmsRetornoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSmsRetornoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSmsRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
