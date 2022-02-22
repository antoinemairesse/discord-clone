import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateServerDialogComponent} from './create-server-dialog.component';

describe('CreateServerDialogComponent', () => {
  let component: CreateServerDialogComponent;
  let fixture: ComponentFixture<CreateServerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateServerDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
