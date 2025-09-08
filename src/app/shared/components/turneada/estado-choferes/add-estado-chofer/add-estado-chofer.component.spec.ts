import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEstadoChoferComponent } from './add-estado-chofer.component';

describe('AddEstadoChoferComponent', () => {
  let component: AddEstadoChoferComponent;
  let fixture: ComponentFixture<AddEstadoChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEstadoChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEstadoChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
