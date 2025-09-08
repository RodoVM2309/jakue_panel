import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDestinoComponent } from './add-destino.component';

describe('AddDestinoComponent', () => {
  let component: AddDestinoComponent;
  let fixture: ComponentFixture<AddDestinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDestinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
