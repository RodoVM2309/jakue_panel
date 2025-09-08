import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoferesNotificacionComponent } from './choferes-notificacion.component';

describe('ChoferesNotificacionComponent', () => {
  let component: ChoferesNotificacionComponent;
  let fixture: ComponentFixture<ChoferesNotificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoferesNotificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoferesNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
