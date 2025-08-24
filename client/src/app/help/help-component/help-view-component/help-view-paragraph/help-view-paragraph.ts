import { Component, input } from '@angular/core';
import { Graphic, IGraphic, IParagraph } from 'soap-models/dist/help';

@Component({
  selector: 'app-help-view-paragraph',
  imports: [],
  templateUrl: './help-view-paragraph.html',
  styleUrl: './help-view-paragraph.scss'
})
export class HelpViewParagraph {
  paragraph = input<IParagraph>();

  getGraphic(graphic: IGraphic): string {
    const grph = new Graphic(graphic);
    let answer = `data:${grph.mimetype};base64, `;
    answer += grph.filedata;
    return answer;
  }
}
