import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTurneadaComponent } from './tipo-turneada.component';

describe('TipoTurneadaComponent', () => {
  let component: TipoTurneadaComponent;
  let fixture: ComponentFixture<TipoTurneadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoTurneadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoTurneadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
