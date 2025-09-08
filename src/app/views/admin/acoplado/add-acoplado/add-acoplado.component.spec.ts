import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAcopladoComponent } from './add-acoplado.component';

describe('AddAcopladoComponent', () => {
  let component: AddAcopladoComponent;
  let fixture: ComponentFixture<AddAcopladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAcopladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAcopladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
