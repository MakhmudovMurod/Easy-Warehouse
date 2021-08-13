



window.addEventListener('focusin', function (e) {
    let name = e.target.name

    if (name != undefined && name.match('delete')) {

        let id = e.target.id
        let req_id = id.substring(4)

        let total = document.getElementById('total-' + req_id).value
        let result_price = document.getElementById(`result_price`).value

        let res_price = +result_price - +total
        document.getElementById(`result_price`).value = res_price

        let discount = document.getElementById(`discount`).value
        if (discount != '') {
            final_price = +res_price - +discount
            document.getElementById(`final_price`).value = final_price
        }
        else {
            final_price = +res_price
            document.getElementById(`final_price`).value = final_price
        }
    }
    else {
        // pass
    }

}, false);


window.addEventListener('input', function (e) {
    let id = e.target.id
    const regex_id = RegExp(/^\d{1,}$/)
    const regex_amount = RegExp(/^(amount-)\d{1,}$/)

    if (id.match('date')) {
        let value = e.target.value
        if (value != '') {
            document.getElementById(`addButton`).disabled = false;
            document.getElementById(`addButton`).title = "Нажмите чтобы добавить продукт";
            document.getElementById(`discount`).disabled = false;
            document.getElementById(`paid_cash`).disabled = false;
            document.getElementById(`result_price`).disabled = false;
            document.getElementById(`final_price`).disabled = false;
        }
        else {
            document.getElementById(`addButton`).disabled = true;
        }
    }
    else if (id.match(regex_id)) {
        let value = e.target.value

        if (value != undefined) {
            prod = arr[value - 1]

            if (prod != undefined) {
                document.getElementById(`class-${id}`).value = prod.class;
                // document.getElementById(`subclass-${id}`).value = prod.subclass;
                // document.getElementById(`drawing-${id}`).value = prod.drawing;
                document.getElementById(`sort-${id}`).value = prod.sort;
                document.getElementById(`price-${id}`).value = prod.price;
                document.getElementById(`amount-${id}`).disabled = false;
                document.getElementById(`total-${id}`).disabled = false;
                document.getElementById(`amount-${id}`).placeholder = prod.quantity;
            }
            else {
                document.getElementById(`class-${id}`).value = '';
                // document.getElementById(`subclass-${id}`).value = '';
                document.getElementById(`drawing-${id}`).value = '';
                document.getElementById(`sort-${id}`).value = '';
                document.getElementById(`price-${id}`).value = '';
                document.getElementById(`amount-${id}`).disabled = true;
                document.getElementById(`amount-${id}`).placeholder = '';
            }
        }
        else {
            document.getElementById(`amount-${id}`).disabled = true;
        }
    }
    else if (id.match('solution_id')) {
        let value = e.target.value

        if (value != undefined) {
            prod = arr[value - 1]

            if (prod != undefined) {
                document.getElementById(`solution-class`).value = prod.class;
                document.getElementById(`solution-subclass`).value = prod.subclass;
                document.getElementById(`solution-drawing`).value = prod.drawing;
                document.getElementById(`solution-sort`).value = prod.sort;
                document.getElementById(`solution-price`).value = prod.price;
                document.getElementById(`solution-amount`).disabled = false;
                document.getElementById(`solution-amount`).placeholder = prod.quantity;
            }
            else {
                document.getElementById(`solution-class`).value = '';
                document.getElementById(`solution-subclass`).value = '';
                document.getElementById(`solution-drawing`).value = '';
                document.getElementById(`solution-sort`).value = '';
                document.getElementById(`solution-price`).value = '';
                document.getElementById(`solution-amount`).disabled = true;
                document.getElementById(`solution-amount`).placeholder = '';
            }
        }
        else {
            document.getElementById(`solution-amount`).disabled = true;
        }
    }
    else if (id.match('solution-amount')){
        let value = e.target.value

        let price = document.getElementById(`solution-price`).value;

        let total = price * value
        document.getElementById(`solution-total`).value = total;

        let problem_summ = document.getElementById(`problem-summ`).value;
        let diff = total - problem_summ
        document.getElementById('difference'). value = diff 
    }
    else if (id.match(regex_amount)) {
        req_id = id.substring(7)
        let value = e.target.value

        let price = document.getElementById(`price-${req_id}`).value;

        let total = price * value
        document.getElementById(`total-${req_id}`).value = total;

        let sums = document.getElementsByName('total')
        let result_price = 0

        for (i = 0; i < sums.length; i++) {
            result_price = +result_price + +sums[i].value
        }
        document.getElementById(`result_price`).value = result_price;

        let discount = document.getElementById(`discount`).value
        if (discount != '') {
            let final_price = +result_price - +discount
            document.getElementById(`final_price`).value = final_price
        }
        else {
            document.getElementById(`final_price`).value = result_price
        }
    }
    else if (id.match('discount')) {
        let value = e.target.value
        let result_price = document.getElementById(`result_price`).value

        let final_price = +result_price - +value
        document.getElementById(`final_price`).value = final_price
    }
    else if (id.match('paid_cash')) {
        let value = e.target.value
        if (value != '') {
            document.getElementById('confirmButton').disabled = false
        }
        else {
            document.getElementById('confirmButton').disabled = true
        }
    }
    else {
        //pass 
    }
}, false);
