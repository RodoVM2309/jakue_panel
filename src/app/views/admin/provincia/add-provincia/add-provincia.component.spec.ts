import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProvinciaComponent } from './add-provincia.component';

describe('AddProvinciaComponent', () => {
  let component: AddProvinciaComponent;
  let fixture: ComponentFixture<AddProvinciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProvinciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProvinciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
