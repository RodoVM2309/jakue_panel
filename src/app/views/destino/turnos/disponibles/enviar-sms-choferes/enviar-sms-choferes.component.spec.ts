import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarSmsChoferesComponent } from './enviar-sms-choferes.component';

describe('EnviarSmsChoferesComponent', () => {
  let component: EnviarSmsChoferesComponent;
  let fixture: ComponentFixture<EnviarSmsChoferesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviarSmsChoferesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarSmsChoferesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
