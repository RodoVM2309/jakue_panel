import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductosComponent } from './add-productos.component';

describe('AddProductosComponent', () => {
  let component: AddProductosComponent;
  let fixture: ComponentFixture<AddProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
