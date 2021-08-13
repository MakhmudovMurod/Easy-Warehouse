function change_problem_div(){
    var status_1 = document.getElementById(`problem_type_1`).checked
    var status_2 = document.getElementById(`problem_type_2`).checked
    var status_3 = document.getElementById(`problem_type_3`).checked
    var req_div_2 = document.getElementById(`problem_div_2`)
    var req_div_3 = document.getElementById(`problem_div_3`)


    if (status_1 == true){
        if (req_div_3.style.display == 'inline'){
            req_div_3.style.opacity = 0.4;
            req_div_3.style.pointerEvents = 'none';
            req_div_2.style.display = 'none'    
        }
        else if (req_div_2.style.display = 'inline'){
            req_div_2.style.opacity = 0.4;
            req_div_2.style.pointerEvents = 'none';
            req_div_3.style.display = 'none'
        }    
    } 
    else if (status_2 == true){
        req_div_2.style.display = 'inline'
        req_div_2.style.opacity = 1;
        req_div_2.style.pointerEvents = 'auto';
        req_div_3.style.display = 'none'
    }
    else if (status_3 == true){
        req_div_3.style.display = 'inline'
        req_div_3.style.opacity = 1;
        req_div_3.style.pointerEvents = 'auto';
        req_div_2.style.display = 'none';
    }
    
    
}

function change_solution_div(){
    var status_1 = document.getElementById(`solution_type_1`).checked
    var status_2 = document.getElementById(`solution_type_2`).checked
    var status_3 = document.getElementById(`solution_type_3`).checked
    var req_div_2 = document.getElementById(`solution_div_2`)
    var req_div_3 = document.getElementById(`solution_div_3`)


    if (status_1 == true){
        if (req_div_3.style.display == 'inline'){
            req_div_3.style.opacity = 0.4;
            req_div_3.style.pointerEvents = 'none';
            req_div_2.style.display = 'none'    
        }
        else if (req_div_2.style.display = 'inline'){
            req_div_2.style.opacity = 0.4;
            req_div_2.style.pointerEvents = 'none';
            req_div_3.style.display = 'none'
        }    
    } 
    else if (status_2 == true){
        req_div_2.style.display = 'inline'
        req_div_2.style.opacity = 1;
        req_div_2.style.pointerEvents = 'auto';
        req_div_3.style.display = 'none'
    }
    else if (status_3 == true){
        req_div_3.style.display = 'inline'
        req_div_3.style.opacity = 1;
        req_div_3.style.pointerEvents = 'auto';
        req_div_2.style.display = 'none';
    }
    
    
}




function addElement(parentID, elementTag, elementID, html){
    var p = document.getElementById(parentID);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementID);
    newElement.innerHTML = html;
    p.appendChild(newElement);
}


function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}


var row_id = 0

function addRow(){
    row_id++
    var html = `
            <div class="form-group">
                <div class="row">

                    <div class="col-md-2" id="id">
                        <input type="text" class="form-control" id="${row_id}" placeholder="ID" min="1" name="product_id">
                    </div>

                    
                    <div class="col-md-2">
                        <input  type="text" class="form-control" placeholder="Класс" id="class-${row_id}"  disabled>
                    </div>

                    <div class="col-md-1">
                        <input  type="text" class="form-control" placeholder="Сорт" id="sort-${row_id}"  disabled>
                    </div> 




                    <div class="col-md-2">
                        <input type="text" class="form-control" id="price-${row_id}" placeholder="Цена" readonly name="product_price">
                    </div>

                    <div class="col-md-2">
                        <input type="text" id="amount-${row_id}" placeholder="Кол-во" class="form-control" disabled name="product_quantity">
                    </div>

                    <div class="col-md-3">
                        <div class="row">
                            <div class="col-md-9">
                                <input type="text" id="total-${row_id}" name="total" class="form-control" placeholder="Сумма" disabled name="deal_overall_cost">
                            </div>
                            <div class="col-md-2">
                                <div class="del-btn">
                                    <a href="" name="delete" id="del-${row_id}" onclick="javascript:removeElement('row-${row_id}'); return false;">
                                    <button type="button" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>`

    addElement('rows','div', `row-${row_id}`, html);
}


function confirm(){
    let final_price = document.getElementById(`final_price`).value
    let paid_cash = document.getElementById(`paid_cash`).value
    let balance = +paid_cash - +final_price 
    
    alert('Заказ подтверждён!\n\nБаланс клиента: ' + balance)
}
