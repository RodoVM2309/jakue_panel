import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTipoCombustibleComponent } from './add-tipo-combustible.component';

describe('AddTipoCombustibleComponent', () => {
  let component: AddTipoCombustibleComponent;
  let fixture: ComponentFixture<AddTipoCombustibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipoCombustibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipoCombustibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
