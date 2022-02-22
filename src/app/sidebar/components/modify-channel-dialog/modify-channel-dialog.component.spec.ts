import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModifyChannelDialogComponent} from './modify-channel-dialog.component';

describe('ModifyChannelDialogComponent', () => {
  let component: ModifyChannelDialogComponent;
  let fixture: ComponentFixture<ModifyChannelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyChannelDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
