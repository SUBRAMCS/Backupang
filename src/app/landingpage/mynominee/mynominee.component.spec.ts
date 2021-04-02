import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MynomineeComponent } from './mynominee.component';

describe('MynomineeComponent', () => {
  let component: MynomineeComponent;
  let fixture: ComponentFixture<MynomineeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MynomineeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MynomineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
