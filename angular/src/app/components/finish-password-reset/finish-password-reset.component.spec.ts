import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishPasswordResetComponent } from './finish-password-reset.component';

describe('FinishPasswordResetComponent', () => {
  let component: FinishPasswordResetComponent;
  let fixture: ComponentFixture<FinishPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishPasswordResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
