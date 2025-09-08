import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarMotivosComponent } from './gestionar-motivos.component';

describe('GestionarMotivosComponent', () => {
  let component: GestionarMotivosComponent;
  let fixture: ComponentFixture<GestionarMotivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarMotivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarMotivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
