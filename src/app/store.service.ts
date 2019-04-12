import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from './todo';

declare const chrome: any;

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  todo$ = new BehaviorSubject<Todo[]>([]);
  private todos: Todo[] = [];
  private storeKey = 'todoStoreKey';

  constructor() {
    // this.restoreFromLocal();
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

  restore() {
    return new Observable((obs) => {
      if (chrome.storage) {
        chrome.storage.sync.get(this.storeKey, (res: any) => {
          obs.next();
          const str = res[this.storeKey] || '[]';
          this.todos = JSON.parse(str);
          this.save();
          console.log('Restored from cloud.');
        });
      } else {
        obs.next();
      }
    });
  }

  private save() {
    const content = JSON.stringify(this.todos);
    // localStorage.setItem(this.storeKey, content);
    if (chrome.storage) {
      const obj = {};
      obj[this.storeKey] = content;
      chrome.storage.sync.set(obj, () => {
        console.log('Synced to cloud.');
      });
    }
    this.push();
  }

  private restoreFromLocal() {
    const dataStr = localStorage.getItem(this.storeKey) || '[]';
    this.todos = JSON.parse(dataStr);
    this.push();
  }

  private push() {
    this.todo$.next(this.todos);
  }
}
