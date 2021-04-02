import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctmyfamilyComponent } from './acctmyfamily.component';

describe('AcctmyfamilyComponent', () => {
  let component: AcctmyfamilyComponent;
  let fixture: ComponentFixture<AcctmyfamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctmyfamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctmyfamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
