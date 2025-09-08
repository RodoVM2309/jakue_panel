import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPersonaComponent } from './roles-persona.component';

describe('RolesPersonaComponent', () => {
  let component: RolesPersonaComponent;
  let fixture: ComponentFixture<RolesPersonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesPersonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
