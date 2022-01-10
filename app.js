// Storage Controller
const StorageCtrl = (function(){
    // public methods
    return {
        storeItem: function(item){
            let items;
            // check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                // push new items
                items.push(item);
                //set ls
                localStorage.setItem('items', JSON.stringify(items)); 
            } else {
                // get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));
                // push new items
                items.push(item);
                // reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        clearStorage: function(){
            if(localStorage.getItem('items') !== null){
                localStorage.setItem('items', JSON.stringify([]));
            } 
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = []; 
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            } 
            return items;
        }  
    } 
})();

// item controller
const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    } 

    const data ={
        items:[],
        total: 0 
    } 

    return {
        clearItems: function(){
            data.items = []  
        } ,
        getItems: function(){
            return data.items
        },
        addItem: function(name, calories){
            // Create ID
            let ID
            if(data.items.length > 0){
                ID = data.items.at(-1).id + 1
            } else {
                console.log('id = 0')
            } 
            // Parse Calories
            calories = parseInt(calories);
            // create new item
            newItem = new Item(ID,name,calories)
            // add new items to list
            data.items.push(newItem)
        }, 
        getTotalCalories: function(){
            let total = 0;
            // loop through items and add calories
            data.items.forEach(function(item){
                total = total + item.calories;
                // return total
            })
            data.total = total
            console.log(total)
            return data.total;
        } ,
        logData: function(){
            return data
        } 
    } 
})();

const UICtrl = (function(){
    const UISelectors ={
        addBtn: ".add-btn",
        editBtn: "#edit-btn",
        updateBtn: "#update-meal-button",
        deleteBtn: "#delete-meal-button",
        backBtn: "#edit-back-button",
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemNameEditInput: "#item-edit-name",
        itemCaloriesInput: "#item-calories",
        itemCaloriesEditInput: "#item-edit-calories",
        itemList: '#item-list',
        totalCalories: '.total-calories',
        addWindow: '.add-window',
        editWindow: '.edit-window'
    } 

    return{
        populateItemList: function(items){
            // create html content
            let html = '';
            
            // parse data and create list items html
            items.forEach(element => {
                html += `<li class="collection-item" id="item-${element.id}">
                <strong>${element.name}: </strong><em>${element.calories} Calories</em>
                <a href="#" class="secondary-content" id="edit-btn">
                <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>    
                `
            });

            document.querySelector("#item-list").innerHTML = html;
        },
        
        getSelectors: function(){
            return UISelectors
        },

        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }  
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        showTotalCalories: function(calories){
            document.querySelector(UISelectors.totalCalories).textContent = calories;
        } 
    } 
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors()
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        document.addEventListener('DOMContentLoaded', getItemsFromStorage)
        document.querySelector(UISelectors.clearBtn).addEventListener('click',itemsClearList)

        const editable = document.querySelectorAll(UISelectors.editBtn)

        for (let i = 0; i < editable.length; i++) {
            editable[i].addEventListener('click', itemEditRequest)
            editable[i].click()
        }
        console.log(document.querySelectorAll(UISelectors.editBtn))
    } 

    const itemEditRequest = function(event){
        console.log("Requested edit")
    }

    // itemAdd submit function
    const itemAddSubmit = function(event){
        // get form input data
        console.log("pressed")
        const input = UICtrl.getItemInput()

        if(input.name !== '' && input.calories !== ''){
            ItemCtrl.addItem(input.name, input.calories)
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories);
            // store in localStorage
            StorageCtrl.storeItem(newItem)
            // clear fields
            UICtrl.clearInput();

        } 

        
        const items = ItemCtrl.getItems()

        UICtrl.populateItemList(items)

        event.preventDefault()
    } 

    const itemsClearList = function(){
        // clear items in list
        ItemCtrl.clearItems();

        // reset calories
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories);

        // clear storage
        StorageCtrl.clearStorage();

        // unpopulate list
        UICtrl.populateItemList([]);
    } 

    const getItemsFromStorage = function(){
        // get items from storage
        const items = StorageCtrl.getItemsFromStorage()
        // populate item list
        items.forEach(function(item){
            ItemCtrl.addItem(item.name,item.calories)
        } )
        
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.populateItemList(items)
    } 

    return{
        init: function(){
            console.log('Initializing app')
            const items = ItemCtrl.getItems()
            console.log(items)

            // populate items list
            UICtrl.populateItemList(items)

            loadEventListeners()
        } 
    } 
})(ItemCtrl, StorageCtrl, UICtrl);

App.init()