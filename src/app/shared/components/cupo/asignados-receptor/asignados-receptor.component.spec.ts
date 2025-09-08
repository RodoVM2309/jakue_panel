import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignadosReceptorComponent } from './asignados-receptor.component';

describe('AsignadosReceptorComponent', () => {
  let component: AsignadosReceptorComponent;
  let fixture: ComponentFixture<AsignadosReceptorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignadosReceptorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignadosReceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
