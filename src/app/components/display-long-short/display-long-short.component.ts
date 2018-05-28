import { Component, OnInit, Input } from '@angular/core';
import { SignalType } from '../../models/Signal';

@Component({
  selector: 'display-long-short',
  templateUrl: './display-long-short.component.html',
  styleUrls: ['./display-long-short.component.css']
})
export class DisplayLongShortComponent implements OnInit {
  class: string;

  @Input("value")
  set Value(v: number) {
    this.value = v;
    this.updateIcon();
  }
  value: number;
  constructor() { }

  ngOnInit() {
  }

  updateIcon() {
    if (this.value == SignalType.Buy || this.value == SignalType.BuyStop || this.value == SignalType.BuyLimit) {
      this.class = "up"
    } else {
      this.class = "down"
    }
  }

}
