import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSorteoComponent } from './add-sorteo.component';

describe('AddSorteoComponent', () => {
  let component: AddSorteoComponent;
  let fixture: ComponentFixture<AddSorteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSorteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
