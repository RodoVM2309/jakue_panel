import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurneadaComponent } from './turneada.component';

describe('TurneadaComponent', () => {
  let component: TurneadaComponent;
  let fixture: ComponentFixture<TurneadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurneadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurneadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
