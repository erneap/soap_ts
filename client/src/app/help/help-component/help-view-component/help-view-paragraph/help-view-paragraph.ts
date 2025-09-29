import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { Graphic, IGraphic, IParagraph } from 'soap-models/help';
import { HelpViewParagraphGraphicDialog } from './help-view-paragraph-graphic-dialog/help-view-paragraph-graphic-dialog';

@Component({
  selector: 'app-help-view-paragraph',
  imports: [ MatTooltip],
  templateUrl: './help-view-paragraph.html',
  styleUrl: './help-view-paragraph.scss'
})
export class HelpViewParagraph {
  paragraph = input<IParagraph>();
  readonly dialog = inject(MatDialog);

  getGraphic(graphic: IGraphic): string {
    const grph = new Graphic(graphic);
    let answer = `data:${grph.mimetype};base64, `;
    answer += grph.filedata;
    return answer;
  }

  enlargeGraphic(id: number) {
    if (this.paragraph() && this.paragraph()!.graphics) {
      this.paragraph()!.graphics!.forEach(graph => {
        if (graph.id === id) {
          const dialogRef = this.dialog.open(HelpViewParagraphGraphicDialog, {
            data: graph,
          });
        }
      })
    }
  }
}
