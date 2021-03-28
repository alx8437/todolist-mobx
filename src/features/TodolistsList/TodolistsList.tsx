import React, {useCallback, useEffect} from 'react'
import {FilterValuesType} from './todolists-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import {Grid, Paper} from '@material-ui/core'
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {observer} from "mobx-react";
import todolistsStoreMobx from "../../test-mobx/todolistsStoreMobx";

import {runInAction} from "mobx";
import tasksStoreMobx from "../../test-mobx/tasksStoreMobx";


export const TodolistsList: React.FC = observer(() => {
    const todolists = todolistsStoreMobx.todolists
    const tasks = tasksStoreMobx.tasks


    useEffect(() => {
        runInAction(() => {
            todolistsStoreMobx.setTodolists()
        })
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        tasksStoreMobx.removeTask(id, todolistId)
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        tasksStoreMobx.addTask(title, todolistId)
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        tasksStoreMobx.updateTask(id, {status}, todolistId)
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        tasksStoreMobx.updateTask(id, {title: newTitle}, todolistId)
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        todolistsStoreMobx.changeTodolistFilter(todolistId, value)
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        todolistsStoreMobx.removeTodolist(id)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        todolistsStoreMobx.changeTodolistTitle(id, title)
    }, [])

    const addTodolist = useCallback((title: string) => {
        todolistsStoreMobx.addTodoList(title)
    }, [])


    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
})
