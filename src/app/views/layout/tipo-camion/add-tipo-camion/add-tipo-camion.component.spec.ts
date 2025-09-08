import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTipoCamionComponent } from './add-tipo-camion.component';

describe('AddTipoCamionComponent', () => {
  let component: AddTipoCamionComponent;
  let fixture: ComponentFixture<AddTipoCamionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipoCamionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipoCamionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
