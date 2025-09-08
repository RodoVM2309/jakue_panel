import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChoferComponent } from './add-chofer.component';

describe('AddChoferComponent', () => {
  let component: AddChoferComponent;
  let fixture: ComponentFixture<AddChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
