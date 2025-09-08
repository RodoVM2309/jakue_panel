import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrdenComponent } from './edit-orden.component';

describe('EditOrdenComponent', () => {
  let component: EditOrdenComponent;
  let fixture: ComponentFixture<EditOrdenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrdenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
