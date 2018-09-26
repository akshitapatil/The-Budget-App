//budget control modeule 
var budgetControl = (function(){
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        //this.percentage = -1;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
   var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp: [],inc: []
        },
        totals: {
            exp: 0,inc: 0
        },
        budget: 0, percentage: -1
    };
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
                data.totals.exp=val;
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
                data.totals.inc=val;
            }
            data.allItems[type].push(newItem);
          return newItem;
        },
        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }            

        },
        getBudget:function(){
            return{
                budget:data.budget,
                income:data.totals.inc,
                expense:data.totals.exp,
                percentage:data.percentage
            }
        },
        test:function(){
            console.log(data);
        }
    }
})();
//the ui control module 
var ui=(function(){
    // dom manipulations
    var domfields={
        input_type:'.add__type',
        input_discription:'.add__description',
        add_value:'.add__value',
        add_btn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        income:'.budget__income--value',
        expense:'.budget__expenses--value',
        budget:'.budget__value',
        percentage:'.budget__expenses--percentage'
    };
    return{
        input_field:function(){
         //retuen input field objects
            return{
            type:document.querySelector(domfields.input_type).value,
            text:document.querySelector(domfields.input_discription).value,
            val:parseFloat(document.querySelector(domfields.add_value).value)
          };
        },
          addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'inc') {
                element = domfields.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = domfields.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',obj.value);
             // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clear:function(){
        var fields; 
           fields=document.querySelectorAll(domfields.input_discription +','+domfields.add_value);
           var fieldsarray=Array.prototype.slice.call(fields);
         fieldsarray.forEach(function(current,id,Array){ 
           current.value="";
         })
       },
        displaybudget:function(obj,type){
            //only done for not null value
            document.querySelector(domfields.income).textContent=obj.income;
            document.querySelector(domfields.expense).textContent=obj.expense;
            document.querySelector(domfields.budget).textContent=obj.budget;
            document.querySelector(domfields.percentage).textContent=obj.percentage+'%';
        },
      //for dom fields 
        get_input:function(){
         return domfields;
     }
    }
})();
//dynamics of the app to appcontrol
var appcontrol=(function(budgetcl,uicl){
    var dom=ui.get_input();
    //event handler function
    function eventlistner(){
       document.querySelector(dom.add_btn).addEventListener('click',operator);
       document.addEventListener('keypress',function(event){
        if(event.keyCode===13||event.which===13){
            operator();  
        }
     })
    }
    var operator=function operations(){
       var input,newitem;
        var input=ui.input_field();
       if(input.text!==""&&!isNaN(input.val)&&(input.val>0)){
        newitem=budgetControl.addItem(input.type,input.text,input.val);
        ui.addListItem(newitem,input.type);
        ui.clear();
           updateBudget();
        }
    }
     var updateBudget = function() {
         var values=ui.input_field(); 
        // 1. Calculate the budget
        budgetControl.calculateBudget();
        // 2. Return the budget
        var budget = budgetControl.getBudget();
        // 3. Display the budget on the UI
         console.log(budget);
         ui.displaybudget(budget,values.type);
    };
    
    return{
           init:function(){
               console.log("the app is started");
               eventlistner();
           }
    } 
})(budgetControl,ui);
// app initialization
appcontrol.init();



