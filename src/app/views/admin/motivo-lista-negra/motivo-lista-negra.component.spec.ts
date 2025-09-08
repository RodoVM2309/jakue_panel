import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoListaNegraComponent } from './motivo-lista-negra.component';

describe('MotivoListaNegraComponent', () => {
  let component: MotivoListaNegraComponent;
  let fixture: ComponentFixture<MotivoListaNegraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoListaNegraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoListaNegraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
