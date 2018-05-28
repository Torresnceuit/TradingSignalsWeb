import { Component, OnInit } from '@angular/core';
import { Signal } from '../../models/Signal';
import { SignalService } from '../../services/signal.service';

@Component({
  selector: 'app-signal-display',
  templateUrl: './signal-display.component.html',
  styleUrls: ['./signal-display.component.css']
})
export class SignalDisplayComponent implements OnInit {
  signals: Array<Signal> = new Array();

  // Map the signal type to string
  SignalTypeMap = {
      "0": "Buy",
      "1": "Sell"
  }

  // Map the State value with the string name
  StateMap = {
    "0": "Pending",
    "1": "Opening",
    "2": "Closed"
  }
  constructor(private signalService: SignalService) { }

  ngOnInit() {
    this.displaySignals();
  }

  // Display all signals
  displaySignals(){
    this.signalService.getSignals().subscribe(signals => {
      this.signals = signals;
    })
  }

}


