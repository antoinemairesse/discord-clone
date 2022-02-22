import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinServerDialogComponent } from './join-server-dialog.component';

describe('JoinServerDialogComponent', () => {
  let component: JoinServerDialogComponent;
  let fixture: ComponentFixture<JoinServerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinServerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinServerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
