import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCorredorComponent } from './vincular-corredor.component';

describe('VincularCorredorComponent', () => {
  let component: VincularCorredorComponent;
  let fixture: ComponentFixture<VincularCorredorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCorredorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCorredorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
