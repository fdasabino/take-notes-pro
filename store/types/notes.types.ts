export interface NoteDocument {
  id: string;
  title?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotesState {
  items: NoteDocument[];
  loading: boolean;
  error: string | null;
  lastFetchedUserId: string | null;
}
