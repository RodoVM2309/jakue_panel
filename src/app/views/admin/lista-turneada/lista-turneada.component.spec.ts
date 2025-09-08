import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTurneadaComponent } from './lista-turneada.component';

describe('ListaTurneadaComponent', () => {
  let component: ListaTurneadaComponent;
  let fixture: ComponentFixture<ListaTurneadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaTurneadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTurneadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
