import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRazonRechazoComponent } from './add-razon-rechazo.component';

describe('AddRazonRechazoComponent', () => {
  let component: AddRazonRechazoComponent;
  let fixture: ComponentFixture<AddRazonRechazoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRazonRechazoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRazonRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
