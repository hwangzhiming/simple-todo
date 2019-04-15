import { Component, NgZone, OnInit } from '@angular/core';
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
  loaded = false;
  allChecked = true;
  oldTodos: {[key: number]: Todo} = {};

  constructor(private storeService: StoreService, private title: Title, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.storeService.todo$.subscribe((data: Todo[]) => {
      this.allTodos = data;
      this.title.setTitle(`Simple Todo (${this.remainCount}/${this.allTodos.length})`);
    });

    this.storeService.restore().subscribe(() => {
      this.loaded = true;
      this.ngZone.run(() => {});
    });
  }

  get todos() {
    let rs: Todo[] = [];
    if (!this.allTodos || !this.allTodos.length) {
      rs = [];
    }
    if (this.filter === 'Completed') {
      rs = this.allTodos.filter(x => x.completed);
    } else if (this.filter === 'Active') {
      rs = this.allTodos.filter(x => !x.completed);
    } else {
      rs = this.allTodos;
    }
    return rs.sort((a, b) => a.id < b.id ? -1 : 1).sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);
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
    this.oldTodos[todo.id] = {...todo};
    this.storeService.update(todo);
  }

  // stopEditing(todo: Todo, value: string) {
  //   todo.title = value;
  //   todo.editing = false;
  //   this.storeService.update(todo);
  // }

  updateEditingTodo(todo: Todo, value: string) {
    if (!value) {
      value = this.oldTodos[todo.id].title;
    }
    todo.title = value;
    todo.editing = false;
    this.storeService.update(todo);
  }

  // cancelEditingTodo(todo: Todo) {
  //   todo.editing = false;
  //   this.storeService.update(todo);
  // }

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
