import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEstandarComponent } from './add-estandar.component';

describe('AddEstandarComponent', () => {
  let component: AddEstandarComponent;
  let fixture: ComponentFixture<AddEstandarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEstandarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEstandarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
