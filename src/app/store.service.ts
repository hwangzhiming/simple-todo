import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private todos: Todo[] = [];
  private storeKey = 'todo.store.key';
  todo$ = new BehaviorSubject<Todo[]>([]);

  constructor() {
    this.restore();
  }


  add(title: string) {
    this.todos.push(new Todo(title));
    this.save();
  }

  remove(id: number) {
    this.todos = this.todos.filter(x => x.id !== id);
    this.save();
  }

  removeCompleted() {
    this.todos = this.todos.filter(x => !x.completed);
    this.save();
  }

  update(todo: Todo) {
    const item = this.todos.find(x => x.id === todo.id);
    item.title = todo.title;
    item.completed = todo.completed;
    item.editing = item.editing;
    this.save();
  }

  markAll(state: boolean) {
    this.todos.map(x => x.completed = state);
    this.save();
  }

  private save() {
    localStorage.setItem(this.storeKey, JSON.stringify(this.todos));
    this.push();
  }

  private restore() {
    const dataStr = localStorage.getItem(this.storeKey) || '[]';
    this.todos = JSON.parse(dataStr);
    this.push();
  }

  private push() {
    this.todo$.next(this.todos);
  }
}
