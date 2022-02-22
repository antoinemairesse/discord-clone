import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModifyServerDialogComponent} from './modify-server-dialog.component';

describe('ModifyServerDialogComponent', () => {
  let component: ModifyServerDialogComponent;
  let fixture: ComponentFixture<ModifyServerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyServerDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyServerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
