import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcopladoComponent } from './acoplado.component';

describe('AcopladoComponent', () => {
  let component: AcopladoComponent;
  let fixture: ComponentFixture<AcopladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcopladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcopladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
