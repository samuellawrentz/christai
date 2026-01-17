export interface BibleVerseResponse {
  reference: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text: string;
  translation_id: string;
  translation_name: string;
}

export interface BollsSearchResult {
  pk: number;
  translation: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface BollsSearchResponse {
  results: BollsSearchResult[];
  exact_matches: number;
  total: number;
}

export type SupportedTranslation = "kjv" | "web" | "asv";
