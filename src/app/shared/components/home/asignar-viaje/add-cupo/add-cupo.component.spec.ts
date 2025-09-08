import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCupoComponent } from './add-cupo.component';

describe('AddCupoComponent', () => {
  let component: AddCupoComponent;
  let fixture: ComponentFixture<AddCupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
