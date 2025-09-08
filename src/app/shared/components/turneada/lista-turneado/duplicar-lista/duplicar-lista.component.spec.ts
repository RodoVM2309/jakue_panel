import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicarListaComponent } from './duplicar-lista.component';

describe('DuplicarListaComponent', () => {
  let component: DuplicarListaComponent;
  let fixture: ComponentFixture<DuplicarListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicarListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicarListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
