import {FilterValuesType, TodolistDomainType} from "../features/TodolistsList/todolists-reducer";
import {makeAutoObservable, runInAction} from "mobx";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import tasksStoreMobx from "./tasksStoreMobx";


class TodolistsStore {
    todolists: Array<TodolistDomainType> = []

    constructor() {
        makeAutoObservable(this)
    }

    setTodolists = async () => {
        const todolists = await todolistsAPI.getTodolists().then(res => res.data);
        runInAction(() => {
            tasksStoreMobx.setTodolists(todolists)
            this.todolists = todolists.map(tl => ({...tl, filter: 'all'}))
        })
    }

    removeTodolist = async (todolistId: string) => {
        const resultCode = await todolistsAPI.deleteTodolist(todolistId).then(res => res.data.resultCode);
        if (resultCode === 0) {
            const index = this.todolists.findIndex(tl => tl.id === todolistId);
            runInAction(() => {
                tasksStoreMobx.removeTodolist(todolistId)
                this.todolists.splice(index, 1)
            })
        }
    }

    addTodoList = async (todolistTitle: string) => {
        try {
            const todolistResponse: TodolistType = await todolistsAPI.createTodolist(todolistTitle).then(res => res.data.data.item);
            const newTodolist: TodolistDomainType = {...todolistResponse, filter: 'all'}
            runInAction(() => {
                tasksStoreMobx.addTodolist(newTodolist.id);
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

    changeTodolistFilter = (todolistId: string, filter: FilterValuesType) => {
        const index = this.todolists.findIndex(tl => tl.id === todolistId);
        this.todolists[index].filter = filter
    }

}

export default new TodolistsStore();

