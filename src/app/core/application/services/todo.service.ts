import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { TodoState } from '@store/state/todo.state';
import { selectTodos } from '@store/selectors/todo.selectors';
import { map } from 'rxjs/operators';
import { TODO_REPOSITORY } from '@core/core.tokens';
import { Todo } from '@core/domain/models/todo.model';
import * as TodoActions from '@store/actions/todo.actions';
import { TodoRepository } from '@core/domain/repositories/todo.repository';
import { TodoCreateDto, TodoUpdateDto } from '@core/domain/models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private filterSubject = new BehaviorSubject<string>('all');

  constructor(
    @Inject(TODO_REPOSITORY) public repository: TodoRepository,
    private store: Store<{ todos: TodoState }>
  ) {}

  getAll(): Observable<Todo[]> {
    return this.repository.getAll();
  }

  getById(id: number): Observable<Todo> {
    return this.repository.getById(id);
  }

  update(id: number, todo: TodoUpdateDto): Observable<Todo> {
    return this.repository.update(id, todo);
  }

  getTodos(): Observable<Todo[]> {
    return this.store.select(selectTodos);
  }

  getPendingTodos(): Observable<Todo[]> {
    return this.getTodos().pipe(
      map(todos => todos.filter(todo => !todo.completed))
    );
  }

  getCompletedTodos(): Observable<Todo[]> {
    return this.getTodos().pipe(
      map(todos => todos.filter(todo => todo.completed))
    );
  }

  getFilter(): Observable<string> {
    return this.filterSubject.asObservable();
  }

  setFilter(filter: string): void {
    this.filterSubject.next(filter);
  }

  create(todo: TodoCreateDto): Observable<Todo> {
    return this.repository.create(todo);
  }

  delete(id: number): Observable<void> {
    return this.repository.delete(id);
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  addTodo(title: string): void {
    const now = new Date();
    this.store.dispatch(TodoActions.addTodo({ 
      todo: { 
        id: Date.now(), 
        title, 
        completed: false,
        createdAt: now,
        updatedAt: now
      } 
    }));
  }

  toggleTodo(id: number): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  deleteTodo(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
} 