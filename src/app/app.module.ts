import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {NavbarComponent} from './navbar/navbar.component';
import {IndexComponent} from './index/index.component';
import {ChatComponent} from './chat/chat.component';
import {PeopleComponent} from './people/people.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {ChannelComponent} from './sidebar/components/channel/channel.component';
import {MessageComponent} from './chat/components/message/message.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {DatePickerComponent} from './register/components/date-picker/date-picker.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {CreateServerDialogComponent} from './navbar/components/create-server-dialog/create-server-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {ReactiveFormsModule} from "@angular/forms";
import {CreateChannelDialogComponent} from './sidebar/components/create-channel-dialog/create-channel-dialog.component';
import {ModifyChannelDialogComponent} from './sidebar/components/modify-channel-dialog/modify-channel-dialog.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ModifyServerDialogComponent} from './navbar/components/modify-server-dialog/modify-server-dialog.component';
import { JoinServerDialogComponent } from './navbar/components/join-server-dialog/join-server-dialog.component';
import {ClipboardModule} from "@angular/cdk/clipboard";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    IndexComponent,
    ChatComponent,
    PeopleComponent,
    ChannelComponent,
    MessageComponent,
    LoginComponent,
    RegisterComponent,
    DatePickerComponent,
    CreateServerDialogComponent,
    CreateChannelDialogComponent,
    ModifyChannelDialogComponent,
    ModifyServerDialogComponent,
    JoinServerDialogComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule,
    DragDropModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
