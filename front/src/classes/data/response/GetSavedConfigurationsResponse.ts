export type GetSavedConfigurationsResponse = SavedConfiguration[];

export interface SavedConfiguration {
  id: string;
  data: string;
  // milliseconds
  date: number;
}
