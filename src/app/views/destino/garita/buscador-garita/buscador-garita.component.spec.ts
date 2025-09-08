import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorGaritaComponent } from './buscador-garita.component';

describe('BuscadorGaritaComponent', () => {
  let component: BuscadorGaritaComponent;
  let fixture: ComponentFixture<BuscadorGaritaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorGaritaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorGaritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
