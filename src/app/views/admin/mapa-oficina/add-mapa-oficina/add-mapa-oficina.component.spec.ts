import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapaOficinaComponent } from './add-mapa-oficina.component';

describe('AddMapaOficinaComponent', () => {
  let component: AddMapaOficinaComponent;
  let fixture: ComponentFixture<AddMapaOficinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapaOficinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapaOficinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
