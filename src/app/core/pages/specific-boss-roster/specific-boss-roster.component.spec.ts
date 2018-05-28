import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificBossRosterComponent } from './specific-boss-roster.component';

describe('SpecificBossRosterComponent', () => {
  let component: SpecificBossRosterComponent;
  let fixture: ComponentFixture<SpecificBossRosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificBossRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificBossRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
