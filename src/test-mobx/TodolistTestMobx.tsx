import React, {useEffect} from "react"
import todolistsStore from "./todolistsStoreMobx"
import {observer} from "mobx-react";

export const TodolistTestMobx = observer(() => {

    const loadTodoList = () => {
        todolistsStore.setTodolists()
    }

    const log = () => {
        const tdId = todolistsStore.todolists.map(tl => tl.title)
        console.log(tdId)
    }

    const removeTodolist = () => {
        todolistsStore.removeTodolist('cc4a5a9c-7db7-4834-b07e-5473fbc51e42')
    }

    const addTodolist = () => {
        todolistsStore.addTodoList("mobx")
    }

    const changeTodolistTitle = () => {
        todolistsStore.changeTodolistTitle("48ed3e68-9de6-43ba-aa75-c6291b5e5cca", "Redux")
    }

    return <React.Fragment>
        <button onClick={loadTodoList}>load</button>
        <button onClick={log}>log</button>
        <button onClick={removeTodolist}>delete</button>
        <button onClick={addTodolist}>add</button>
        <button onClick={changeTodolistTitle}>change</button>

    </React.Fragment>
})