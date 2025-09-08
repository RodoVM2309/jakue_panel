import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapaRadaresComponent } from './add-mapa-radares.component';

describe('AddMapaRadaresComponent', () => {
  let component: AddMapaRadaresComponent;
  let fixture: ComponentFixture<AddMapaRadaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapaRadaresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapaRadaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
