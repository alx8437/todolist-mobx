import {TasksStateType, UpdateDomainTaskModelType} from "../features/TodolistsList/tasks-reducer";
import {makeAutoObservable} from "mobx";
import {TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {TodolistDomainType} from "../features/TodolistsList/todolists-reducer";

class tasksStoreMobx {
    tasks: TasksStateType = {};

    constructor() {
        makeAutoObservable(this)
    }

    removeTask = async (taskId: string, todolistId: string) => {
        try {
            const result = await todolistsAPI.deleteTask(todolistId, taskId)
            if (result.data.resultCode === 0) {
                const index = this.tasks[todolistId].findIndex(t => t.id === taskId)
                this.tasks[todolistId].splice(index, 1)
            }
        } catch (e) {
            console.log(e)
        }
    }

    addTasks = async (title: string, todolistId: string) => {
        try {
            const response = await todolistsAPI.createTask(todolistId, title);
            if (response.data.resultCode === 0) {
                this.tasks[todolistId].push(response.data.data.item);
            }
        } catch (e) {
            console.log(e)
        }
    }

    updateTask = async (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => {
        const task = this.tasks[todolistId].find(t => t.id === taskId);
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
            if (response.data.resultCode === 0) {
                const index = this.tasks[todolistId].findIndex(t => t.id === taskId);
                this.tasks[todolistId][index].title = apiModel.title
            }
        } catch (e) {
            console.log(e)
        }
    }

    addTodolist = (todolistId: string) => {
        this.tasks[todolistId] = [];
    }

    removeTodolist = (todolistId: string) => {
        delete this.tasks[todolistId];
    }

    setTodolists = (todolists: Array<TodolistDomainType>) => {
        todolists.forEach(tl => this.tasks[tl.id] = []);
    }

    setTasks = async (todolistId: string) => {
        const response = await todolistsAPI.getTasks(todolistId);
        if (response.data.resultCode === 0) {
            this.tasks[todolistId] = response.data.items
        }
    }

}

export default new tasksStoreMobx();