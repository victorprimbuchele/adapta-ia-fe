import type { ISODateString } from "./user";

export interface Grade {
  id: string;
  name: string;
  sortOrder: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
