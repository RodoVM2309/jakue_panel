import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregadorComponent } from './entregador.component';

describe('EntregadorComponent', () => {
  let component: EntregadorComponent;
  let fixture: ComponentFixture<EntregadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntregadorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
