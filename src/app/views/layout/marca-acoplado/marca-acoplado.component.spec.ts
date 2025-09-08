import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaAcopladoComponent } from './marca-acoplado.component';

describe('MarcaAcopladoComponent', () => {
  let component: MarcaAcopladoComponent;
  let fixture: ComponentFixture<MarcaAcopladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcaAcopladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcaAcopladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
