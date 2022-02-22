import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  year = new Date().getFullYear();

  constructor() {
  }

  ngOnInit(): void {
  }

}
