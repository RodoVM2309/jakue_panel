import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesRetiroComponent } from './ordenes-retiro.component';

describe('OrdenesRetiroComponent', () => {
  let component: OrdenesRetiroComponent;
  let fixture: ComponentFixture<OrdenesRetiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesRetiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesRetiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
