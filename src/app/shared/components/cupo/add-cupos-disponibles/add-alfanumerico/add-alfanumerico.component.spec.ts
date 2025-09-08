import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAlfanumericoComponent } from './add-alfanumerico.component';

describe('AddAlfanumericoComponent', () => {
  let component: AddAlfanumericoComponent;
  let fixture: ComponentFixture<AddAlfanumericoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAlfanumericoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlfanumericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
