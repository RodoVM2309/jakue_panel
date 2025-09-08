import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarDadoresComponent } from './configurar-dadores.component';

describe('ConfigurarDadoresComponent', () => {
  let component: ConfigurarDadoresComponent;
  let fixture: ComponentFixture<ConfigurarDadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurarDadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarDadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
