import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditarAutoridadComponent } from './add-editar-autoridad.component';

describe('AddEditarAutoridadComponent', () => {
  let component: AddEditarAutoridadComponent;
  let fixture: ComponentFixture<AddEditarAutoridadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditarAutoridadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditarAutoridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
