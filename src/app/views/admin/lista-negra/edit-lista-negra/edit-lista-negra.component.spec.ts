import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListaNegraComponent } from './edit-lista-negra.component';

describe('EditListaNegraComponent', () => {
  let component: EditListaNegraComponent;
  let fixture: ComponentFixture<EditListaNegraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditListaNegraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditListaNegraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
