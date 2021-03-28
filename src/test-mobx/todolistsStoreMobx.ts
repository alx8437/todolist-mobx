import {
    changeTodolistFilterAC,
    FilterValuesType,
    TodolistDomainType
} from "../features/TodolistsList/todolists-reducer";
import {action, flow, makeAutoObservable, makeObservable, observable, runInAction} from "mobx";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import tasksStoreMobx from "./tasksStoreMobx";


class TodolistsStore {
    _todolists: Array<TodolistDomainType> = []

    constructor() {
        makeAutoObservable(this)
    }

    setTodolists = async () => {
        const todolists = await todolistsAPI.getTodolists().then(res => res.data);
        runInAction(() => {
            tasksStoreMobx.setTodolists(todolists)
            this._todolists = todolists.map(tl => ({...tl, filter: 'all'}))
        })
    }

    removeTodolist = async (todolistId: string) => {
        const resultCode = await todolistsAPI.deleteTodolist(todolistId).then(res => res.data.resultCode);
        if (resultCode === 0) {
            const index = this._todolists.findIndex(tl => tl.id === todolistId);
            runInAction(() => {
                tasksStoreMobx.removeTodolist(todolistId)
                this._todolists.splice(index, 1)
            })
        }
    }

    addTodoList = async (todolistTitle: string) => {
        try {
            const todolistResponse: TodolistType = await todolistsAPI.createTodolist(todolistTitle).then(res => res.data.data.item);
            const newTodolist: TodolistDomainType = {...todolistResponse, filter: 'all'}
            runInAction(() => {
                tasksStoreMobx.addTodolist(newTodolist.id);
                this._todolists.unshift(newTodolist);
            })
        } catch (e) {
            console.log(e)
        }
    }

    changeTodolistTitle = async (todolistId: string, title: string) => {
        try {
            const res = await todolistsAPI.updateTodolist(todolistId, title);
            if (res.data.resultCode === 0) {
                const index = this._todolists.findIndex(tl => tl.id === todolistId);
                runInAction(() => {
                    this._todolists[index].title = title;
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    changeTodolistFilter = (todolistId: string, filter: FilterValuesType) => {
        const index = this._todolists.findIndex(tl => tl.id === todolistId);
        this._todolists[index].filter = filter
    }

    get todolists() {
        return this._todolists
    }
    
    
}

export default new TodolistsStore();

