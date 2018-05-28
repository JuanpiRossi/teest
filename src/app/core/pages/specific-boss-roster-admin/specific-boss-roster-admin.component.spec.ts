import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificBossRosterAdminComponent } from './specific-boss-roster-admin.component';

describe('SpecificBossRosterAdminComponent', () => {
  let component: SpecificBossRosterAdminComponent;
  let fixture: ComponentFixture<SpecificBossRosterAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificBossRosterAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificBossRosterAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
