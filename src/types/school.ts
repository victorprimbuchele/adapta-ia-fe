import type { ISODateString } from "./user";

export interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
