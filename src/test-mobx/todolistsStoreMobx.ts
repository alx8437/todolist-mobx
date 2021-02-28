import {TodolistDomainType} from "../features/TodolistsList/todolists-reducer";
import {action, flow, makeAutoObservable, makeObservable, observable, runInAction} from "mobx";
import {todolistsAPI, TodolistType} from "../api/todolists-api";


class TodolistsStore {
    todolists: Array<TodolistDomainType> = []

    constructor() {
        makeAutoObservable(this)
    }

    setTodolists = async () => {
        const tasks = await todolistsAPI.getTodolists().then(res => res.data);
        runInAction(() => {
            this.todolists = tasks.map(tl => ({...tl, filter: 'all'}))
        })
    }

    removeTodolist = async (todolistId: string) => {
        const resultCode = await todolistsAPI.deleteTodolist(todolistId).then(res => res.data.resultCode);
        if (resultCode === 0) {
            const index = this.todolists.findIndex(tl => tl.id === todolistId);
            runInAction(() => {
                this.todolists.splice(index, 1)
            })
        }
    }

    addTodoList = async (todolistTitle: string) => {
        try {
            const todolistResponse: TodolistType = await todolistsAPI.createTodolist(todolistTitle).then(res => res.data.data.item);
            const newTodolist: TodolistDomainType = {...todolistResponse, filter: 'all'}
            runInAction(() => {
                this.todolists.unshift(newTodolist);
            })
        } catch (e) {
            console.log(e)
        }
    }

    changeTodolistTitle = async (todolistId: string, title: string) => {
        try {
            const res = await todolistsAPI.updateTodolist(todolistId, title);
            if (res.data.resultCode === 0) {
                const index = this.todolists.findIndex(tl => tl.id === todolistId);
                runInAction(() => {
                    this.todolists[index].title = title;
                })
            }
        } catch (e) {
            console.log(e)
        }

    }
}

export default new TodolistsStore();

