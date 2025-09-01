import { Component, input } from '@angular/core';
import { Graphic, IGraphic } from 'soap-models/dist/help';

@Component({
  selector: 'app-help-editor-paragraph-graphic',
  imports: [],
  templateUrl: './help-editor-paragraph-graphic.html',
  styleUrl: './help-editor-paragraph-graphic.scss'
})
export class HelpEditorParagraphGraphic {
  graphic = input<IGraphic>();

  getGraphic(): string | null {
    if (this.graphic()) {
      const grph = new Graphic(this.graphic());
      let answer = `data:${grph.mimetype};base64, `;
      answer += grph.filedata;
      return answer;
    }
    return null
  }
}
