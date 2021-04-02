import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctNominationComponent } from './acct-nomination.component';

describe('AcctNominationComponent', () => {
  let component: AcctNominationComponent;
  let fixture: ComponentFixture<AcctNominationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctNominationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctNominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
