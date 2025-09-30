import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Graphic, HelpPageUpdateRequest, IGraphic } from 'soap-models/help';

@Component({
  selector: 'app-help-editor-paragraph-graphic',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './help-editor-paragraph-graphic.html',
  styleUrl: './help-editor-paragraph-graphic.scss'
})
export class HelpEditorParagraphGraphic {
  graphic = input<IGraphic>();
  key = input<string>();
  changed = output<HelpPageUpdateRequest>();

  getGraphic(): string | null {
    if (this.graphic()) {
      const grph = new Graphic(this.graphic());
      let answer = `data:${grph.mimetype};base64, `;
      answer += grph.filedata;
      return answer;
    }
    return null
  }

  onDelete() {
    const parts = this.key()!.split('|');
    const update: HelpPageUpdateRequest = {
      pageid: parts[0],
      paragraphid: Number(parts[1]),
      graphicid: this.graphic()!.id,
      field: 'delete',
      value: ''
    }
    this.changed.emit(update);
  }
}
