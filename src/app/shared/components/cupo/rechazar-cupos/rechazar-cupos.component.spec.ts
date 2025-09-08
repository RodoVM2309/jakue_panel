import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechazarCuposComponent } from './rechazar-cupos.component';

describe('RechazarCuposComponent', () => {
  let component: RechazarCuposComponent;
  let fixture: ComponentFixture<RechazarCuposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechazarCuposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechazarCuposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
