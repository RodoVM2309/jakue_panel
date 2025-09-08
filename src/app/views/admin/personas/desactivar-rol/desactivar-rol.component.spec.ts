import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivarRolComponent } from './desactivar-rol.component';

describe('DesactivarRolComponent', () => {
  let component: DesactivarRolComponent;
  let fixture: ComponentFixture<DesactivarRolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesactivarRolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesactivarRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
