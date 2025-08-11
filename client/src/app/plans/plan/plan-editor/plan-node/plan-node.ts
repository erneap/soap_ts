import { Component, input, OnInit, output } from '@angular/core';
import { AppStateService } from '../../../../services/app-state.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlanNode } from '../plan-editor';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-plan-node',
  imports: [
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './plan-node.html',
  styleUrl: './plan-node.scss'
})
export class PlanNodeComponent implements OnInit {
  node = input<PlanNode>();
  change = output<string>();
  readForm = new FormGroup({
    book: new FormControl('', { nonNullable: true }),
    chapter: new FormControl('', { nonNullable: true }),
    start: new FormControl('', { nonNullable: true }),
    end: new FormControl('', { nonNullable: true })
  });
  isExpanded: boolean = false;

  constructor(
    private appStatus: AppStateService
  ) {}

  ngOnInit(): void {
    
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
