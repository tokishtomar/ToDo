let toDoItems = [];
let currentList;
let flag = true;

function add(item) {
    if(flag) {
        let id = item.parentNode.parentNode.getAttribute("id");
        if(id == "popup-list" || id == "main-container") {
            document.getElementById("popup-list").classList.add("active");
            $("#main-container").css("filter","blur(16px)");
            if(id == "popup-list")
            addList();
        }
        else {
            document.getElementById("popup-item").classList.add("active");
            $("#main-container").css("filter","blur(16px)");
            currentList = item;
        }
    }
    else {
        document.getElementById("popup-item").classList.add("active");
        $("#grid-container").css("filter","blur(16px)");
        currentList = item;
    }
}

function closeDialogBox(item) {
    if(flag) {
        let id = item.parentNode.parentNode.getAttribute("id");
        if(id == "popup-list") {
            document.getElementById("popup-list").classList.remove("active");
            $("#main-container").css("filter","blur(0px)");
        }
        else {
            document.getElementById("popup-item").classList.remove("active");
            $("#main-container").css("filter","blur(0px)");
        }
    }
    else {
        document.getElementById("popup-item").classList.remove("active");
        $("#grid-container").css("filter","blur(0px)");
    }    
}

function addList() {
    let input = document.getElementById("input-box-list").value;
    if(input != "") {
        document.getElementById("popup-list").classList.remove("active");
        $("#main-container").css("filter","blur(0px)");
        $(".heading-3").css("display","none");
        let todo = {
            input,
            subTask : [],
            id : Date.now()
        };
        toDoItems.push(todo);
        addCard(todo);
    }
}

function addCard(todo) {
    let item = document.createElement("div");
    item.className = "card-item";
    item.setAttribute("datakey",todo.id);
    item.innerHTML = `
                <div class="item-heading-1" onclick="openList(this)">${todo.input}</div>
                <ul id="list-1"></ul>
                <div class="icon-container">
                <i class="bi bi-trash-fill " style="color : orangered; font-size : 30px;cursor: pointer" onclick="deleteCard(this)"></i> 
                <i class="fas fa-plus-circle fa-2x" style="color: rgb(77, 125, 228); cursor: pointer; margin-left: 5px" onclick="add(this)"></i>
                </div>                      
    `;
    document.getElementById("card-container").appendChild(item);
}

function addItem() {
    let input = document.getElementById("input-box-item").value;
    if(input != "") {
        document.getElementById("popup-item").classList.remove("active");
        if(flag)
        $("#main-container").css("filter","blur(0px)");
        else
        $("#grid-container").css("filter","blur(0px)");
        let list = currentList.parentNode.parentNode.childNodes[3];
        let id = currentList.parentNode.parentNode.getAttribute("datakey");
        let node = document.createElement("li");
        node.setAttribute("datakey", Date.now());
        node.innerHTML = `
            ${input}<button class = 'markDone' onclick="markDone(this)">Mark Done</button>
        `;
        for(let i = 0;i < toDoItems.length;i++) {
            if(toDoItems[i].id == id) {
                toDoItems[i].subTask.push({
                    input,
                    marked : false,
                    id : node.getAttribute("datakey")
                });
                break;
            }
        }
        list.appendChild(node);
    }
    console.log(toDoItems);
}

function deleteCard(item) {
    let list = item.parentNode.parentNode;
    for (let i = 0; i < toDoItems.length; i++) {
        if (toDoItems[i].id == list.getAttribute("datakey")) {
          toDoItems.splice(i, 1);
        }
    }
    if(toDoItems.length == 0) 
    $(".heading-3").css("display","block");
    console.log(toDoItems);
    if(flag)
    list.parentNode.removeChild(list);
    else
    goBack();
}

function markDone(item) {
    let list = item.parentNode.parentNode.parentNode;
    let listItem = item.parentNode;
    listItem.className = "marked";
    item.remove();
    for(let i = 0 ; i < toDoItems.length ; i++ ) {
        if(toDoItems[i].id == list.getAttribute("datakey")) {
            for(let j = 0; j <toDoItems[i].subTask.length; j++) {
                if(toDoItems[i].subTask[j].id == listItem.getAttribute("datakey")) {
                    toDoItems[i].subTask[j].marked = true;
                    break; 
                }   
            }
        }
    }
    console.log(toDoItems);
}

function openList(element) {
    flag = false;
    $("#main-container").css("display","none");
    $("#grid-container").css("display","grid");
    let id = element.parentNode.getAttribute("datakey");
    let currentToDo;
    for(let i = 0 ; i < toDoItems.length ; i++) {
        if(toDoItems[i].id == id) {
            currentToDo = toDoItems[i];
            break;
        }
    }
    let item = document.getElementById("grid-container");
    item.childNodes[3].innerHTML = currentToDo.input;
    item.childNodes[5].setAttribute("datakey",id);
    item.childNodes[5].childNodes[1].innerHTML = currentToDo.input;
    let list = document.getElementById("list");
    list.querySelectorAll('*').forEach(n => n.remove());
    for(let i = 0 ; i < currentToDo.subTask.length ; i++) {
        let node = addSubItem(currentToDo.subTask[i]);
        list.appendChild(node);
    }  
}

function goBack() {
    console.log(toDoItems);
    flag = true;
    $("#grid-container").css("display","none");
    $("#main-container").css("display","block");
    let cardContainer = document.getElementById("card-container");
    cardContainer.querySelectorAll('*').forEach(n => n.remove());
    let list = cardContainer.children;
    for(let i = 0 ; i < toDoItems.length ; i++) {
        addCard(toDoItems[i]);
        let item = list[i].childNodes[3];
        for(let j = 0 ; j < toDoItems[i].subTask.length ; j++) {
            let node = addSubItem(toDoItems[i].subTask[j]);
            item.appendChild(node);
        }
    }
}

function addSubItem(todo) {
    let node = document.createElement("li");
    node.innerHTML = `${todo.input}`;
    node.setAttribute("datakey" , todo.id);
    if(todo.marked == true)
        node.className = "marked";
    else
        node.innerHTML = `${todo.input}<button class = 'markDone' onclick="markDone(this)">Mark Done</button>`;
    return node;
}