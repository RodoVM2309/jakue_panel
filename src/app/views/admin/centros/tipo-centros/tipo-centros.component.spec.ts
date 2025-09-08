import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCentrosComponent } from './tipo-centros.component';

describe('TipoCentrosComponent', () => {
  let component: TipoCentrosComponent;
  let fixture: ComponentFixture<TipoCentrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoCentrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCentrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
