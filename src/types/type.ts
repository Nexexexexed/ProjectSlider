export interface TimeSegment {
  id: number;
  periodFrom: number;
  periodTo: number;
  title: string;
  category: string;
  events: Event[];
}

export interface Event {
  id: number;
  date: string;
  description: string;
}
