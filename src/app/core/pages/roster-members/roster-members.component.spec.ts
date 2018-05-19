import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterMembersComponent } from './roster-members.component';

describe('RosterMembersComponent', () => {
  let component: RosterMembersComponent;
  let fixture: ComponentFixture<RosterMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
