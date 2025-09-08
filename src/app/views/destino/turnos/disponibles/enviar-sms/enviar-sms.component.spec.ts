import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarSmsComponent } from './enviar-sms.component';

describe('EnviarSmsComponent', () => {
  let component: EnviarSmsComponent;
  let fixture: ComponentFixture<EnviarSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviarSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
