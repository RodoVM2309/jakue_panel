import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrigenComponent } from './add-origen.component';

describe('AddOrigenComponent', () => {
  let component: AddOrigenComponent;
  let fixture: ComponentFixture<AddOrigenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrigenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
