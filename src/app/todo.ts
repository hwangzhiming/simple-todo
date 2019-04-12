export class Todo {
  id: number;
  title: string;
  completed: boolean;
  editing: boolean;

  constructor(title: string) {
    this.id = Date.now();
    this.title = title.trim();
    this.completed = false;
    this.editing = false;
  }
}
