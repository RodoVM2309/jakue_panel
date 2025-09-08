import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamionAcopladoComponent } from './camion-acoplado.component';

describe('CamionAcopladoComponent', () => {
  let component: CamionAcopladoComponent;
  let fixture: ComponentFixture<CamionAcopladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamionAcopladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamionAcopladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
