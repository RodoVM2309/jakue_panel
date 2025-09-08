import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarArriboComponent } from './confirmar-arribo.component';

describe('ConfirmarArriboComponent', () => {
  let component: ConfirmarArriboComponent;
  let fixture: ComponentFixture<ConfirmarArriboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarArriboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarArriboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
