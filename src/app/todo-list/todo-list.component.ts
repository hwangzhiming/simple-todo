import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';
import { Todo } from '../todo';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  newTodoText: string;
  allTodos: Todo[] = [];
  filter = 'All';
  allChecked = true;
  constructor(private storeService: StoreService, private title: Title) { }

  ngOnInit() {
    this.storeService.todo$.subscribe((data: Todo[]) => {
      this.allTodos = data;
      this.title.setTitle(`TODO (${this.remainCount}/${this.allTodos.length})`);
    });
  }

  get todos() {
    if (!this.allTodos || !this.allTodos.length) {
      return [];
    }
    if (this.filter === 'Completed') {
      return this.allTodos.filter(x => x.completed);
    } else if (this.filter === 'Active') {
      return this.allTodos.filter(x => !x.completed);
    } else {
      return this.allTodos;
    }
  }

  addTodo() {
    this.storeService.add(this.newTodoText);
    this.newTodoText = '';
  }

  toggleCompletion(todo: Todo) {
    todo.completed = !todo.completed;
    this.storeService.update(todo);
  }

  editTodo(todo: Todo) {
    todo.editing = true;
    this.storeService.update(todo);
  }

  stopEditing(todo: Todo, value: string) {
    todo.title = value;
    todo.editing = false;
    this.storeService.update(todo);
  }

  updateEditingTodo(todo: Todo, value: string) {
    todo.title = value;
    todo.editing = false;
    this.storeService.update(todo);
  }

  cancelEditingTodo(todo: Todo) {
    todo.editing = false;
    this.storeService.update(todo);
  }

  remove(todo: Todo) {
    this.storeService.remove(todo.id);
  }

  removeCompleted() {
    this.storeService.removeCompleted();
  }

  get completedCount() {
    return this.allTodos.filter(x => x.completed).length;
  }

  get remainCount() {
    return this.allTodos.filter(x => !x.completed).length;
  }

  setFilter(f?: string) {
     this.filter = f;
  }

  markAll(state: boolean) {
    this.storeService.markAll(state);
  }

}
