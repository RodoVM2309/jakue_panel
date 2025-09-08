import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCamionComponent } from './add-camion.component';

describe('AddCamionComponent', () => {
  let component: AddCamionComponent;
  let fixture: ComponentFixture<AddCamionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCamionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCamionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
