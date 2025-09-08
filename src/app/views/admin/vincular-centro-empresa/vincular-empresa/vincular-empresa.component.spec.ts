import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularEmpresaComponent } from './vincular-empresa.component';

describe('VincularEmpresaComponent', () => {
  let component: VincularEmpresaComponent;
  let fixture: ComponentFixture<VincularEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularEmpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
