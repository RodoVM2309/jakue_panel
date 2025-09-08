import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularOperadorComponent } from './vincular-operador.component';

describe('VincularOperadorComponent', () => {
  let component: VincularOperadorComponent;
  let fixture: ComponentFixture<VincularOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
