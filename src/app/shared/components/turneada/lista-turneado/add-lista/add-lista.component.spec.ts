import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListaComponent } from './add-lista.component';

describe('AddListaComponent', () => {
  let component: AddListaComponent;
  let fixture: ComponentFixture<AddListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
