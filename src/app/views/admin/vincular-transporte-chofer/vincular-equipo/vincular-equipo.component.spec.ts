import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularEquipoComponent } from './vincular-equipo.component';

describe('VincularEquipoComponent', () => {
  let component: VincularEquipoComponent;
  let fixture: ComponentFixture<VincularEquipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularEquipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
