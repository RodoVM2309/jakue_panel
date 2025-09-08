import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConcursoComponent } from './add-concurso.component';

describe('AddConcursoComponent', () => {
  let component: AddConcursoComponent;
  let fixture: ComponentFixture<AddConcursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConcursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConcursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
