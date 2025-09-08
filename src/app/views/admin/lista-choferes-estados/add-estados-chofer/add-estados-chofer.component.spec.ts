import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEstadosChoferComponent } from './add-estados-chofer.component';

describe('AddEstadosChoferComponent', () => {
  let component: AddEstadosChoferComponent;
  let fixture: ComponentFixture<AddEstadosChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEstadosChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEstadosChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
