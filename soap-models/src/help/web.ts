import { IPage } from "./page";

export interface HelpPagesResponse {
  pages: IPage[];
}

export interface HelpPageUpdateRequest {
  pageid: string;
  paragraphid?: number;
  bulletid?: number;
  graphicid?: number;
  field: string;
  value: string;
  filedata?: string;
}