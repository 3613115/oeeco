export type BlogTable = {
  columns: string[];
  rows: string[][];
};

export type BlogSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  note?: {
    label: string;
    text: string;
  };
  table?: BlogTable;
};

export type BlogRelatedLink = {
  label: string;
  href: string;
  description: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  intro: string[];
  relatedLinks: BlogRelatedLink[];
  sections: BlogSection[];
  testedWith?: string[];
  verdict?: string;
  keyTakeaways?: string[];
  featured?: boolean;
};
