import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListaNegraComponent } from './add-lista-negra.component';

describe('AddListaNegraComponent', () => {
  let component: AddListaNegraComponent;
  let fixture: ComponentFixture<AddListaNegraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddListaNegraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddListaNegraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
