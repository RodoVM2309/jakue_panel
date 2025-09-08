import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrigenesComponent } from './origenes.component';

describe('OrigenesComponent', () => {
  let component: OrigenesComponent;
  let fixture: ComponentFixture<OrigenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrigenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrigenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
