import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapaTalleresComponent } from './add-mapa-talleres.component';

describe('AddMapaTalleresComponent', () => {
  let component: AddMapaTalleresComponent;
  let fixture: ComponentFixture<AddMapaTalleresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapaTalleresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapaTalleresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
