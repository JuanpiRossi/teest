import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharSearcherComponent } from './char-searcher.component';

describe('CharSearcherComponent', () => {
  let component: CharSearcherComponent;
  let fixture: ComponentFixture<CharSearcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharSearcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
