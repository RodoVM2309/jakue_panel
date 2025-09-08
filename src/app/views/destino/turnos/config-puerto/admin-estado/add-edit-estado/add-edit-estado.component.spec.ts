import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEstadoComponent } from './add-edit-estado.component';

describe('AddEditEstadoComponent', () => {
  let component: AddEditEstadoComponent;
  let fixture: ComponentFixture<AddEditEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
