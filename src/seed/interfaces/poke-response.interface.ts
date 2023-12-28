export interface PokeResponse {
  count: number;
  next: string;
  previous: null;
  results: Result[];
  forms: Form[];
}
export interface Form {
  name: string;
  url: string;
  image_url: string;
}
export interface Result {
  name: string;
  url: string;
  forms: Form[];
}
