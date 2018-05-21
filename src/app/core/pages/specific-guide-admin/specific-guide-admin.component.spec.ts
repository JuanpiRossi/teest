import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificGuideAdminComponent } from './specific-guide-admin.component';

describe('SpecificGuideAdminComponent', () => {
  let component: SpecificGuideAdminComponent;
  let fixture: ComponentFixture<SpecificGuideAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificGuideAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificGuideAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
