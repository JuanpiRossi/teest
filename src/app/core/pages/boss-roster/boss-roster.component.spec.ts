import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BossRosterComponent } from './boss-roster.component';

describe('BossRosterComponent', () => {
  let component: BossRosterComponent;
  let fixture: ComponentFixture<BossRosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BossRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
