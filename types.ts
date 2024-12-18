export type UserProfile = {
  displayName: string;
  photoURL?: string;
  email: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  date: string;
  progress: number;
  uid: string;
  tasks: Task[]; 
};

export type Travel = {
  id: string;
  destination: string;
  description?: string;
  date?: string;
  lat?: number;
  lng?: number;
};

export type Task = {
  id: string;
  name: string;
  completed: boolean;
};