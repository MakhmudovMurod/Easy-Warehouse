$(document).ready(function () {
  let table = document.getElementById('product1');

  let r_list = []
  let id_list = []

  $(".add-btn").click(function () {
    let r = $(this).closest('tr').index() + 1
    r_list.push(r)
    let id = table.rows[r].cells[0].innerHTML
    id_list.push(id)
    let num = $(this).parentsUntil("td").find('input').val()

    let amt = table.rows[r].cells[5].innerHTML
    let price_ = table.rows[r].cells[6].innerHTML
    let price = price_.substr(1)
    //console.log(price)

    if ($(`#cartTable #n${id}`).length) {
      let tab = document.getElementById('cartTable');
      let pre_num = $(`#cartTable #n${id}`)[0].textContent

      let sum = +pre_num + +num
      let tot_ = sum * price
      let tot = tot_.toFixed(2);

      let result_amt = amt - num
      $(`#product1  tr:eq(${r}) td:eq(5)`).html(result_amt)
      $(`#cartTable #n${id}`).html(sum)
      $(`#cartTable #t${id}`).html(`$${tot}`)
    } else {
      let class_ = table.rows[r].cells[1].innerHTML
      let subclass = table.rows[r].cells[2].innerHTML
      let drawing = table.rows[r].cells[3].innerHTML
      let sort = table.rows[r].cells[4].innerHTML
      let tot_ = +num * +price
      let tot = tot_.toFixed(2);


      let result_amt = amt - num
      $(`#product1  tr:eq(${r}) td:eq(5)`).html(result_amt)
      //console.log(tot)
      $('#cartTable tr:last').after(`<tr>
                                                    <td id="p${id}">${id}</td>
                                                    <td>${class_}</td>
                                                    <td>${subclass}</td>
                                                    <td>${drawing}</td>
                                                    <td>${sort}</td>
                                                    <td>$${price}</td>
                                                    <td id="n${id}">${num}</td>
                                                    <td id="t${id}">$${tot}</td>
                                                    <td class="del-btn">
                                                        <div class="col-12">
                                                            <div class="del-btn" id=${id}><button type="button"
                                                                class="btn btn-block btn-danger btn-sm">
                                                                <i class="nav-icon fas fa-trash"></i></button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    </tr>`);
    }

  });


  // $("#cartTable").on("click", ".del-btn", function () {
  //   $(this).closest("tr").remove();
  //   $(`#product1  tr:eq(${r}) td:eq(5)`).html(amt)
  // });

});

