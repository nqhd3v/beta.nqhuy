export type tNotionDoc = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: Date;
  href: string;
  content: any;
}

export type tNotionActivity = {
  id: string;
  name: string;
  dist: string;
  speed: string;
  type: string;
}
