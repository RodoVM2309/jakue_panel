import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularChoferComponent } from './vincular-chofer.component';

describe('VincularChoferComponent', () => {
  let component: VincularChoferComponent;
  let fixture: ComponentFixture<VincularChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
