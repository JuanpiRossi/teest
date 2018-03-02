import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsesComponent } from './parses.component';

describe('ParsesComponent', () => {
  let component: ParsesComponent;
  let fixture: ComponentFixture<ParsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
