import { MathValidators } from './../math-validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import {delay, filter,scan } from 'rxjs/operators';


@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css']
})
export class EquationComponent implements OnInit {
  secondsPerSolution = 0;
  mathForm = new FormGroup({
    a: new FormControl(this.randomNumber()),
    b: new FormControl(this.randomNumber()),
    answer: new FormControl('')
  }, [MathValidators.addition('answer', 'a', 'b')]);


  // Writing getter functions
  get a() {
    return this.mathForm.get('a').value;
  }

  get b() {
    return this.mathForm.get('b').value;
  }


  constructor() { }

  ngOnInit(){

    this.mathForm.statusChanges.pipe(
      filter(value => value === 'VALID'), delay(100), scan( (acc) => {
        return {
          numberSolved: acc.numberSolved + 1,
          startTimer: acc.startTimer
        };
      }, { numberSolved: 0, startTimer: new Date()})
    ).subscribe( ({numberSolved, startTimer}) => {
      this.secondsPerSolution = (
        new Date().getTime() - startTimer.getTime()
      ) / numberSolved / 1000;
      this.mathForm.setValue({
        a: this.randomNumber(),
        b: this.randomNumber(),
        answer: ''
      });
    });
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }

}
