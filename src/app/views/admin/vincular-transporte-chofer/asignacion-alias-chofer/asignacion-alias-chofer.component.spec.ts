import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionAliasChoferComponent } from './asignacion-alias-chofer.component';

describe('AsignacionAliasChoferComponent', () => {
  let component: AsignacionAliasChoferComponent;
  let fixture: ComponentFixture<AsignacionAliasChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionAliasChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionAliasChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
