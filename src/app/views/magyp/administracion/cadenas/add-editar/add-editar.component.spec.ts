import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditarComponent } from './add-editar.component';

describe('AddEditarComponent', () => {
  let component: AddEditarComponent;
  let fixture: ComponentFixture<AddEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
