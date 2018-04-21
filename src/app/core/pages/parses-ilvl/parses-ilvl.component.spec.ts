import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsesIlvlComponent } from './parses-ilvl.component';

describe('ParsesIlvlComponent', () => {
  let component: ParsesIlvlComponent;
  let fixture: ComponentFixture<ParsesIlvlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParsesIlvlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParsesIlvlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
