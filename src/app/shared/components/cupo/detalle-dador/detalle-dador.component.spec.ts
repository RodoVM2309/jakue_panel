import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDadorComponent } from './detalle-dador.component';

describe('DetalleDadorComponent', () => {
  let component: DetalleDadorComponent;
  let fixture: ComponentFixture<DetalleDadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleDadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleDadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
