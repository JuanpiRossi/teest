import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BossRosterAdminComponent } from './boss-roster-admin.component';

describe('BossRosterAdminComponent', () => {
  let component: BossRosterAdminComponent;
  let fixture: ComponentFixture<BossRosterAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossRosterAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BossRosterAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
