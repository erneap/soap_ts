import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { AppStateService } from '../../../services/app-state.service';
import { BooksService } from '../../../books/books-service';
import { BibleBook, IBibleBook, IPlan } from 'soap-models/dist/plans';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface PlanNode {
  id: string;
  name: string;
  children?: PlanNode[]
}

@Component({
  selector: 'app-plan-editor',
  imports: [ MatTreeModule, MatButtonModule, MatIconModule ],
  templateUrl: './plan-editor.html',
  styleUrl: './plan-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanEditor implements OnInit {
  formStyle = signal('');
  private books: BibleBook[] = [];
  plan = input<IPlan>();
  planNodes: PlanNode[] = [];

  childrenAccessor = (node: PlanNode) => node.children ?? [];

  hasChild = (_: number, node: PlanNode) => !!node.children && node.children.length > 0;

  constructor(
    private appState: AppStateService,
    private bookService: BooksService
  ) {  }

  ngOnInit(): void {
    const height = this.appState.viewHeight - 84;
    const width = this.appState.viewWidth - 60;
    let lWidth = width * .3;
    if (lWidth > 300) { lWidth = 300; }
    let eWidth = width - (lWidth + 45);
    this.formStyle.set(`min-height: ${height}px; max-height: ${height}px;`
      + `width: ${eWidth}px;`);

    this.books = [];
    this.bookService.getBookList().subscribe(res => {
      const booklist = res.body as IBibleBook[];
      booklist.forEach(bk => {
        this.books.push(new BibleBook(bk));
      });
      this.books.sort((a,b) => a.compareTo(b));
    });
  }

  getBook(id: string): string {
    let answer = '';
    this.books.forEach(bk => {
      if (bk.abbrev.toLowerCase() === id.toLowerCase()) {
        answer = bk.title;
      }
    });
    return answer;
  }

  setPlanNodes() {
    const months = [ 'January', 'Febuary', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December' ];
    const plan = this.plan();
    this.planNodes = [];
    if (plan) {
      const parent: PlanNode = {
        id: plan.id!,
        name: plan.name,
        children: []
      }
      plan.months.forEach(month => {
        const child: PlanNode = {
          id: month.month.toString(),
          name: months[month.month - 1], 
          children: []
        }
        month.days.forEach(day => {
          const dayChild: PlanNode = {
            id: day.dayOfMonth.toString(),
            name: day.dayOfMonth.toString(),
            children: []
          }
          day.readings.forEach(read => {
            let label = `${this.getBook(read.book)} ${read.chapter}`;
            if (read.verseStart && read.verseEnd && read.verseStart > 0) {
              label += `:${read.verseStart}-${read.verseEnd}`;
            }
            const readNode: PlanNode = {
              id: read.id.toString(),
              name: label,
              children: []
            };
            dayChild.children!.push(readNode);
          });
          const addReadNode: PlanNode = {
            id: 'newreading',
            name: 'Add New Daily Reading',
          }
          dayChild.children!.push(addReadNode);
          child.children?.push(dayChild);
        });
        const addDayNode: PlanNode = {
          id: 'addday',
          name: 'Add New Day'
        };
        child.children?.push(addDayNode);
        parent.children?.push(child);
      });
      const addMonthNode: PlanNode = {
        id: 'addmonth',
        name: 'Add New Month/Plan Set'
      }
      parent.children?.push(addMonthNode);
      this.planNodes.push(parent);
    }
  }
}
