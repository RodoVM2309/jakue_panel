import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesManualesComponent } from './notificaciones-manuales.component';

describe('NotificacionesManualesComponent', () => {
  let component: NotificacionesManualesComponent;
  let fixture: ComponentFixture<NotificacionesManualesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesManualesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesManualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
