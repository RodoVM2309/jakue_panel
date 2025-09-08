import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddZonaCentroComponent } from './add-zona-centro.component';

describe('AddZonaCentroComponent', () => {
  let component: AddZonaCentroComponent;
  let fixture: ComponentFixture<AddZonaCentroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddZonaCentroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddZonaCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
