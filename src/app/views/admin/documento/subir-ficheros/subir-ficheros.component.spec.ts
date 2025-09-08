import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirFicherosComponent } from './subir-ficheros.component';

describe('SubirFicherosComponent', () => {
  let component: SubirFicherosComponent;
  let fixture: ComponentFixture<SubirFicherosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirFicherosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirFicherosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
