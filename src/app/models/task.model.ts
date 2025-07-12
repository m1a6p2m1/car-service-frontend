export interface SubTask {
  id: number;
  subTaskName: string;
  subTaskPrice?: any;
  status?: any
}

export interface Task {
  id: any;
  taskName: string;
  subTasks: SubTask[];
  description: String;
  totalTaskPrice: String;
  shortDescription: String;
}