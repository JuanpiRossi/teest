import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidesAdminComponent } from './guides-admin.component';

describe('GuidesAdminComponent', () => {
  let component: GuidesAdminComponent;
  let fixture: ComponentFixture<GuidesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
