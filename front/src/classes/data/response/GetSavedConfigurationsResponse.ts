export interface GetSavedConfigurationsResponse {
  savedConfigurations: string[];
}

export interface SavedConfiguration {
  id: string;
  data: string;
}
