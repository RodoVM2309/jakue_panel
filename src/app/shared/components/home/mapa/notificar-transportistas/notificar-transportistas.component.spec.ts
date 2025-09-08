import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificarTransportistasComponent } from './notificar-transportistas.component';

describe('NotificarTransportistasComponent', () => {
  let component: NotificarTransportistasComponent;
  let fixture: ComponentFixture<NotificarTransportistasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificarTransportistasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificarTransportistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
