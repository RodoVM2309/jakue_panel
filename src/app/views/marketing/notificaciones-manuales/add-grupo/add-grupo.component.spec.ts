import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrupoComponent } from './add-grupo.component';

describe('AddGrupoComponent', () => {
  let component: AddGrupoComponent;
  let fixture: ComponentFixture<AddGrupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
