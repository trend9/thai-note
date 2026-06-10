export interface Phrase {
  phrase_ja: string;
  romaji: string;
  meaning_ja: string;
  meaning_th: string;
  hint: string;
}

export interface Lesson {
  id: number;
  title_ja: string;
  title_th: string;
  category: string;
  category_th: string;
  char: string;
  stroke_count: number;
  how_to_write_ja: string;
  how_to_write_th: string;
  important_phrases: Phrase[];
  explanation_th: string;
  tip_th: string;
  meta_description?: string;
}
