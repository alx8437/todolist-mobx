import {TasksStateType, UpdateDomainTaskModelType} from "../features/TodolistsList/tasks-reducer";
import {makeAutoObservable, runInAction} from "mobx";
import {TaskType, todolistsAPI, TodolistType, UpdateTaskModelType} from "../api/todolists-api";
import {TodolistDomainType} from "../features/TodolistsList/todolists-reducer";

class tasksStoreMobx {
    _tasks: TasksStateType = {};

    constructor() {
        makeAutoObservable(this)
    }

    removeTask = async (taskId: string, todolistId: string) => {
        try {
            const result = await todolistsAPI.deleteTask(todolistId, taskId)
            if (result.data.resultCode === 0) {
                const index = this._tasks[todolistId].findIndex(t => t.id === taskId)
                runInAction(() => {
                    this._tasks[todolistId].splice(index, 1)
                })

            }
        } catch (e) {
            console.log(e)
        }
    }

    addTask = async (title: string, todolistId: string) => {
        try {
            const response = await todolistsAPI.createTask(todolistId, title);
            if (response.data.resultCode === 0) {
                runInAction(() => {
                    this._tasks[todolistId].push(response.data.data.item);
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    updateTask = async (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => {
        const task = this._tasks[todolistId].find(t => t.id === taskId);
        if (!task) {

            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        try {
            const response = await todolistsAPI.updateTask(todolistId, taskId, apiModel);
            debugger
            if (response.data.resultCode === 0) {
                const index = this._tasks[todolistId].findIndex(t => t.id === taskId);
                runInAction(() => {
                    const updateTask = {...this._tasks[todolistId][index], ...domainModel}
                    this._tasks[todolistId][index] = updateTask
                    debugger
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    addTodolist = (todolistId: string) => {
        this._tasks[todolistId] = [];
    }

    removeTodolist = (todolistId: string) => {
        delete this._tasks[todolistId];
    }

    setTodolists = (todolists: Array<TodolistType>) => {
        todolists.forEach(tl => this._tasks[tl.id] = []);
    }

    setTasks = async (todolistId: string) => {
        const response = await todolistsAPI.getTasks(todolistId);
        runInAction(() => {
            this._tasks = {...this._tasks, [todolistId]: response.data.items}
        })
    }

    get tasks() {
        return this._tasks
    }

}

export default new tasksStoreMobx();