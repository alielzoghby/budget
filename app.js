//////////////////preload///////////////////////////
var loading = document.querySelector("#loading")

setTimeout(
    function () {
        loading.style.display = "none"
    }, 1500)


////////////////////////////////////////////////
/////////////////////BUDGET////////////////////
//////////////////////////////////////////////
var budgetyController = (function () {

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.persentage = -1
    }
    Expenses.prototype.calcPresentage =
        function (total) {
            if (total > 0) {
                this.persentage = (this.value / total) * 100
                this.persentage = Math.round(this.persentage)
            } else {
                this.persentage = "--"
            }
        }


    var calculateTotaL = function (type) {
        var sum = 0;
        data.allItem[type].forEach(function (c) {
            sum += c.value
            return sum
        })
        data.totalItem[type] = sum;
    }

    var data = {
        allItem: {
            inc: [],
            exp: []
        },
        totalItem: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        persentage: -1
    };

    return {
        getItem: function (type, description, value) {

            var newItem, ID

            if (data.allItem[type].length > 0) {
                ID = data.allItem[type][data.allItem[type].length - 1].id + 1
            } else {
                ID = 0
            }


            if (type === "exp") {
                newItem = new Expenses(ID, description, value)
            } else if (type === "inc") {
                newItem = new Income(ID, description, value)
            }

            data.allItem[type].push(newItem)

            return newItem
        },
        upgradeBudget: function () {
            ///calculate total 
            calculateTotaL("exp");
            calculateTotaL("inc");

            ///calculate budget 
            data.budget = data.totalItem["inc"] - data.totalItem["exp"]

            ///calculate persentage 
            if (data.totalItem["inc"] > 0) {
                data.persentage = (data.totalItem["exp"] / data.totalItem["inc"]) * 100
                if (data.totalItem["exp"] > 0) {
                    data.persentage = Math.round(data.persentage)
                }


            } else {
                data.persentage = -1
            }

            ////calculate persentage item   
            for (i = 0; i < data.allItem["exp"].length; i++) {
                data.allItem["exp"][i].calcPresentage(data.totalItem.inc)
            }
        },
        getTotal: function () {
            return {
                totalInc: data.totalItem["inc"],
                totalExp: data.totalItem["exp"],
                budget: data.budget,
                persentage: data.persentage,
            }
        },
        deletItemFromData: function (type, id) {
            var index, arr

            arr = data.allItem[type].forEach(
                function (e, i) {
                    if (e.id == id) {
                        index = i
                    }
                }
            )
            if (index !== -1) {
                data.allItem[type].splice(index, 1)
            }
        },
        getPersentage: function () {
            return data.allItem["exp"]
        },
        testing: function () {
            console.log(data)
        }

    }
})();


///////////////////////////////////////////////////////
/////////////////////UI CONTROLLER////////////////////
/////////////////////////////////////////////////////
var uiController = (function () {

    ///////////////////////variable
    var domString = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: '.add__btn',
        expensesList: '.expenses__list',
        incomeList: '.income__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpensesValue: '.budget__expenses--value',
        budgetExpensesPercentage: '.budget__expenses--percentage',
        contaner: '.container',
        itemPercentage: ".item__percentage",
        titledate: ".budget__title--month",

    };
    displayNumber = function (num, type) {
        var splitNum, int, dec;

        num = Math.abs(num)
        num = num.toFixed(2)
        splitNum = num.split(".")
        int = splitNum[0]
        dec = splitNum[1]


        if (int.length > 6) {
            int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6, int.length - 3) + ',' + int.substr(int.length - 3)
        } else if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3)
        }

        return (type === "inc" ? "+" : "-") + " " + int + (dec === "00" ? ".0" : "." + dec)
    }

    //////////////////////return 
    return {
        getInput: function () {
            return {
                type: document.querySelector(domString.inputType).value,
                description: document.querySelector(domString.inputDescription).value,
                value: parseFloat(document.querySelector(domString.inputValue).value),
            }
        },
        addListItem: function (obj, type) {
            var html, element;
            ///creat html string with placeholder text
            if (type === "inc") {
                element = domString.incomeList
                html = '<div class="item clearfix" id="inc-' + obj.id + '"><div class="item__description">' + obj.description + '</div><div class="right clearfix"><div class="item__value">' + displayNumber(obj.value, type) + '</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button> </div></div></div>'
            } else {
                element = domString.expensesList
                html = '<div class="item clearfix" id="exp-' + obj.id + '"><div class="item__description">' + obj.description + '</div><div class="right clearfix"><div class="item__value">' + displayNumber(obj.value, type) + '</div><div class="item__percentage">' + obj.persentage + '%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>'
            }
            ///insertt to html dom 
            document.querySelector(element).insertAdjacentHTML("beforeend", html)

        },
        updateItemPersentage: function (obj) {
            if (obj.length > 0) {
                allItemPersentage = document.querySelectorAll(domString.itemPercentage).forEach(function (e, i) {
                    e.innerHTML = obj[i].persentage + "%"
                })
            }
        },
        clearFeilds: function () {
            var feilds = document.querySelectorAll(domString.inputDescription + ',' + domString.inputValue)
            feilds.forEach(e => e.value = '')
            document.querySelector(domString.inputDescription).focus()
        },
        displayBudget: function (obj) {
            document.querySelector(domString.budgetValue).textContent = obj.budget > 0 ? displayNumber(obj.budget, 'inc') : displayNumber(obj.budget, "exp");
            document.querySelector(domString.budgetIncomeValue).textContent = obj.totalInc > 0 ? displayNumber(obj.totalInc, "inc") : 0;
            document.querySelector(domString.budgetExpensesValue).textContent = obj.totalExp > 0 ? displayNumber(obj.totalExp, "exp") : 0;
            if (obj.persentage > 0) {
                document.querySelector(domString.budgetExpensesPercentage).textContent = obj.persentage + "%";
            } else {
                document.querySelector(domString.budgetExpensesPercentage).textContent = "---"
            }
        },
        displayDate: function () {
            var now, year, month, months

            now = new Date();

            year = now.getFullYear();

            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            month = months[now.getMonth()];

            document.querySelector(domString.titledate).textContent = month + " " + year

        },
        changeInput: function () {
            document.querySelectorAll(domString.inputType + "," + domString.inputValue + "," + domString.inputDescription).forEach(
                function (e) {
                    e.classList.toggle("red-focus")
                }
            )
            document.querySelector(domString.addBtn).classList.toggle("red")

        },
        DOM: function () {
            return domString
        }
    }
})();


////////////////////////////////////////////////////
/////////////////////CONTROLLER////////////////////
//////////////////////////////////////////////////
var Controller = (function (budgetyCtrl, uiCtrl) {

    var setupEventListener = function () {
        var domString = uiController.DOM()

        document.querySelector(domString.addBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem()
            }
        })

        document.querySelector(domString.contaner).addEventListener("click", ctrDeleteItem)

        document.querySelector(domString.inputType).addEventListener("change", uiCtrl.changeInput)
    }


    var updateBadget = function () {
        ////calculate budget
        budgetyController.upgradeBudget()

        ///get result 
        var total = budgetyController.getTotal()

        ///to doom  
        uiCtrl.displayBudget(total)
    }


    var updatePresntageItem = function () {

        var persentages = budgetyController.getPersentage()
        uiCtrl.updateItemPersentage(persentages)
    }


    var ctrlAddItem = function () {

        // 1. Get the field input data
        var input = uiCtrl.getInput()

        if (input.description !== "" && input.value !== "" && !isNaN(input.value)) {
            // 2. Add the item to the budget controller
            var newItem = budgetyController.getItem(input.type, input.description, input.value)

            // 3. Calculate and update budgetand percentages
            updateBadget()

            // 4. Add the item to the UI
            uiCtrl.addListItem(newItem, input.type)

            // 5. Clear the fields
            uiCtrl.clearFeilds()

            // 6.update presentage item
            updatePresntageItem()

        }
    }


    var ctrDeleteItem = function (e) {
        var Item, splitItem, type, id

        Item = e.target.parentNode.parentNode.parentNode.parentNode

        if (Item.id) {

            splitItem = Item.id.split("-")
            type = splitItem[0]
            id = parseInt(splitItem[1])

            //delet item from data
            budgetyController.deletItemFromData(type, id)

            // delet item from ui 
            Item.remove()

            // Calculate and update budgetand percentages
            updateBadget()
        }

        // update presentage item
        updatePresntageItem()
    }

    return {
        init: function () {
            setupEventListener()
            uiCtrl.displayDate()
        }
    }

})(budgetyController, uiController)


Controller.init()


/////////////////////////dark mode//////////////////
var chk = document.getElementById('chk');

chk.addEventListener('change', () => {
    document.querySelector(".top").classList.toggle("pop-wallpaper")
    document.body.classList.toggle("dark-body")
    document.querySelectorAll(".item").forEach(e => e.classList.toggle("red"))

});