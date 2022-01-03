const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    } 

    const data ={
        items:[
            {id: 0, name: 'Steak Dinnner', calories: 1200},   
            {id: 1, name: 'Cookie', calories: 400}, 
            {id: 2, name: 'Eggs', calories: 300}
        ],
        total: 0 
    } 

    return {
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
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        itemList: '#item-list',
        totalCalories: '.total-calories'
    } 

    return{
        populateItemList: function(items){
            // create html content
            let html = '';
            
            // parse data and create list items html
            items.forEach(element => {
                html += `<li class="collection-item" id="item-${element.id}">
                <strong>${element.name}: </strong><em>${element.calories} Calories</em>
                <a href="#" class="secondary-content">
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

const App = (function(ItemCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors()
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
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
            // clear fields
            UICtrl.clearInput();

        } 

        const items = ItemCtrl.getItems()

        UICtrl.populateItemList(items)

        event.preventDefault()
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
})(ItemCtrl, UICtrl);

App.init()