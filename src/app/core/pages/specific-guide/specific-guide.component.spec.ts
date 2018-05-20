import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificGuideComponent } from './specific-guide.component';

describe('SpecificGuideComponent', () => {
  let component: SpecificGuideComponent;
  let fixture: ComponentFixture<SpecificGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
