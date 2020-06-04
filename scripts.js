const form = document.querySelector('form')
const todoInput = document.querySelector('.todo-input')
const todoButton = document.querySelector('.todo-button')
const todoList = document.querySelector('.todo-list')
const todoContainer = document.querySelector('.todo-container')
const filterTodo = document.querySelector('.filter-todo')

const saveDB = item => {
    let list = JSON.parse(localStorage.getItem('list'))
    if (list == null || !Object.keys(list).length) {
        localStorage.setItem('list', JSON.stringify({
            "1": {
                id : 1,
                value: item,
                completed: false
            }
        }));
        return
    }
    const arr = Object.keys(list)
    let index = +arr[arr.length - 1] + 1
    list = {...list,
        [`${index}`]: {
            id : index,
            value: item,
            completed: false
        }
    }
    localStorage.setItem('list', JSON.stringify(list))
}

/**
 * o : all
 * 1 : completed
 * 2 : uncompleted
 */
const drawList = option => {
    let list = JSON.parse(localStorage.getItem('list'))
    if ( list == null || !Object.keys(list).length) 
        return
    if(option == 1){
        list = Object.values(list).reduce((acc,curr)=> !curr.completed ? acc : ( { ...acc, [`${curr.id}`] : {...curr}   }),{})
    }
    if(option == 2) {
        list = Object.values(list).reduce((acc,curr)=> curr.completed ? acc : ({...acc,[`${curr.id}`] : {...curr} }),{})
    }
    todoList.innerHTML=``
    for(let key in list){
        if(!list.hasOwnProperty(key))
            continue
        const todoDiv = document.createElement('div')
        todoDiv.classList.add('todo')
    
        list[key].completed ? todoDiv.classList.add('completed') : null

        const newTodo = document.createElement('li')
        newTodo.classList.add('todo-text')
        let value = todoInput.value.trim()
        newTodo.innerText = list[key].value
        newTodo.classList.add('todo-item')

        todoDiv.appendChild(newTodo)

        const completedButton = document.createElement('button')
        completedButton.innerHTML = `<i class="fas fa-check"></i>`
        completedButton.classList.add('complete-btn')

        todoDiv.appendChild(completedButton)

        const trashdButton = document.createElement('button')
        trashdButton.innerHTML = `<i class="fas fa-trash"></i>`
        trashdButton.classList.add('trash-btn')

        todoDiv.appendChild(trashdButton)

        todoList.appendChild(todoDiv)
        todoDiv.id = key
        trashdButton.dataset.id = key
        completedButton.dataset.id = key
    }
}

todoButton.addEventListener('click', event => {
    event.preventDefault()
    let value = todoInput.value.trim() 
    if (!value.length) return
    saveDB(value)
    drawList(filterTodo.selectedIndex)
    todoInput.value = ""
})


const deleteItem = key => {
    let list = JSON.parse(localStorage.getItem('list'))
    if ( list == null || !Object.keys(list).length) 
        return
    delete list[key]
    localStorage.setItem('list', JSON.stringify(list))
}
const changeState = key => {
    let list = JSON.parse(localStorage.getItem('list'))
    if ( list == null || !Object.keys(list).length) 
        return
    list[key].completed = !list[key].completed
    localStorage.setItem('list', JSON.stringify(list))
}

todoContainer.addEventListener('click', event => {
    const target = event.target
    if (target.closest('.trash-btn') !== null) {
        const todo = target.closest('.trash-btn').parentElement
        todo.classList.add('fall')
        todo.addEventListener('transitionend',()=>{
            deleteItem(todo.id)
            todo.remove()
            drawList(filterTodo.selectedIndex)
        })
    }
    if (target.closest('.complete-btn') !== null) {
        const todo = target.closest('.complete-btn').parentElement
        changeState(todo.id)
        todo.classList.toggle('completed')
        drawList(filterTodo.selectedIndex)
    }
})
filterTodo.addEventListener('change',event=>{
    drawList(filterTodo.selectedIndex)
})

drawList(filterTodo.selectedIndex)
todoInput.value = ""
