import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarSmsTransComponent } from './enviar-sms-trans.component';

describe('EnviarSmsTransComponent', () => {
  let component: EnviarSmsTransComponent;
  let fixture: ComponentFixture<EnviarSmsTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviarSmsTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarSmsTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
