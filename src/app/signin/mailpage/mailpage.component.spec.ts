import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailpageComponent } from './mailpage.component';

describe('MailpageComponent', () => {
  let component: MailpageComponent;
  let fixture: ComponentFixture<MailpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
