import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message, MessageService} from "../services/message.service";
import {ChannelService} from "../services/channel.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Timestamp} from "@angular/fire/firestore";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  channelName: string = 'salon';
  @ViewChild('chat') chat: ElementRef | undefined;
  channelUID: number = -1;
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2000)])
  })
  notifier: Subject<any> = new Subject<any>();


  constructor(private messageService: MessageService, private channelService: ChannelService) {
  }

  ngOnInit(): void {
    this.messageService.init()
    //scroll to bottom when chat box height changes
    const resizeObserver = new ResizeObserver(entries => {
      if(this.chat){
        this.chat.nativeElement.scrollTop = entries[0].target.scrollHeight
      }
    })
    let doc = document.getElementById('chat')
    if(doc){
      resizeObserver.observe(doc)
    }

    this.messageService.messages.pipe(takeUntil(this.notifier)).subscribe((next: any) => {
      if (next) {
        this.messages = next;

      }
    })
    this.channelService.selectedChannel.pipe(takeUntil(this.notifier)).subscribe(next => {
      if (next) {
        this.channelUID = next.uid;
        this.channelName = next.name;
      } else {
        this.channelName = '';
      }
    })
  }

  ngOnDestroy() {
    this.messageService.destroy()
    this.notifier.next()
    this.notifier.complete()
  }

  get message() {
    return this.messageForm.get('message');
  }

  sendTextMessage() {
    if (this.messageForm.valid && this.message && this.channelUID != -1) {
      this.messageService.sendTextMessage(this.channelUID.toString(), this.message.value)
      this.message.setValue('');
    }
  }

}
