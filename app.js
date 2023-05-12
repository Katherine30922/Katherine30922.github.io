// select item----------------------------------------------------------------------------------------------------------------------------------------------------------------
const 
dates=document.querySelector(".date"),
descriptions=document.querySelector(".description"),
amounts=document.querySelector(".amount"),
detailTable=document.querySelector(".detail-table"),
categories=document.querySelectorAll(".category-item"),
deleteBtns=document.querySelectorAll(".deleteBtn"),
categoriesSum=document.querySelectorAll(".category-sum"),
total=document.getElementById("total"),
alert=document.querySelector(".alert-text"),
clearBtn=document.querySelector(".clearbtn"),
confirmbtn=document.querySelectorAll(".confirm"),
popOut=document.querySelector(".pop-out");


// event listener--------------------------------------------------------------------------------------------------------------------------------------------------------------
//add new detail to table
let category;//declare it outside, so that every function can use it
categories.forEach(function(id){
  id.addEventListener('click',function(event){
    category=event.currentTarget.id;
    addItem(category);
    calculateSum(category);
    reset();
  })  
}) 
//able to delete original row function when page loads
window.addEventListener("load", function() {
  deleteItem();
  });
window.addEventListener("DOMContentLoaded", setupItems);
window.addEventListener('DOMContentLoaded',displayDataOnSumTable());

clearBtn.addEventListener('click',function(){
  popOut.style.display="block";
  confirmbtn.forEach(function(btn){
    btn.addEventListener('click', function(e){
      const choice=e.currentTarget.classList;
      if(choice.contains("no")){
        popOut.style.display="none";
      }else if(choice.contains("yes")){
        clearItems();
        clearSumTable();
        popOut.style.display="none";
      }
    })
  })
})
// functions-------------------------------------------------------------------------------------------------------------------------------------------------------------------
function displayAlert(text){
    alert.textContent=text;
    alert.classList.add("alert");
    setTimeout(function(){
        alert.textContent="";
        alert.classList.remove("alert");
    },1500)
}
//add new row to table---------------------------------------------------
function addItem(categoryname){
  var id="id-"+Math.random().toString(10).slice(8);
// get input value
  const 
  date=dates.value,
  description=descriptions.value,
  amount=amounts.value;
  
  if(date==""||description==""||amount==""){//make sure all blanks was filled in
    displayAlert("please fill in all the blanks");
      reset();
  }else if(amount<0){
    displayAlert("the amount cannot be negative.");//the amount cannot be negative.
      categorySums.innerHTML="";
  }else{
    //create new row
      const detailRow=document.createElement('tr');
    // add id
      let attr=document.createAttribute("data-id");
      attr.value=id;
      detailRow.setAttributeNode(attr); 
    //add class
      detailRow.classList.add("detailItem");
        detailRow.innerHTML=
            `<td>${date}</td>
            <td>${categoryname}</td>
            <td>${description}</td>
            <td>${amount}</td>
            <button class="deleteBtn"><i class="fa-regular fa-trash-can"></i></button>`
      //append child
        detailTable.appendChild(detailRow);
        addToLocalStorage(id,date,categoryname,description,amount);
        deleteItem();
    }
  }
//delete row---------------------------------------------------------------
function deleteItem() {
  const deleteBtns = document.querySelectorAll(".deleteBtn");
  deleteBtns.forEach(function(btn){
    btn.addEventListener('click',function(e){
      const deletebtn=e.currentTarget.parentElement;
      if (deletebtn.parentNode === detailTable) {
        const id = deletebtn.getAttribute("data-id"); // get the id of the detail object
        detailTable.removeChild(deletebtn);
        deleteSum(e);
        removeFromLocalStorage(id);
      }
    });
  });
}
// reset--------------------------------------------------------------------
function reset(){
    descriptions.value="";
    amounts.value="";
}
//add amount to aggregate table---------------------------------------------------------------
let sum=0;
function calculateSum(category) {
  const amount=parseInt(amounts.value.trim()); //get input value
  if (isNaN(amount)) {//make sure amount is number only
    displayAlert("Please enter a valid number");
    return;
  }
  const categorySum = document.querySelector(`#${category}+td span`);
  let Sum=parseInt(categorySum.innerHTML.trim());//sum in the original arrry
  if(isNaN(Sum)){
    Sum=0;
  }
  Sum+=amount;
  categorySum.innerHTML=Sum;
  //change total
  let totalsum=0;
  const catSums=document.querySelectorAll(".catSum");
  catSums.forEach(catSum => {
    const sum = parseInt(catSum.innerHTML.trim());
    if(!isNaN(sum)){
      totalsum+=sum;
    }
  });
  total.innerHTML=totalsum;
}
//delete amount from aggregate table----------------------------------------------
function deleteSum(e) {
  let sum2=0;
  //change category sum 
  const deleteAmount = parseInt(e.currentTarget.parentElement.children[3].innerHTML);//get the amount in the detail
  category=e.currentTarget.parentElement.children[1].innerHTML;// get the category of the deleted item
  const categorySum = document.querySelector(`#${category}+td span`);
  const Sum=parseInt(categorySum.innerHTML);//sum in the original arrry
  sum2=Sum-deleteAmount;// subtract the deleted amount from the overall sum
  if(sum2!==0){
    categorySum.innerHTML=sum2;
  }else{
    categorySum.innerHTML="";
  }
  // change total
  let sum=parseInt(total.innerHTML);
    sum-=deleteAmount;
    if(sum!==0){
      total.innerHTML=sum;
    }else{
      total.innerHTML="";
    }
}
function clearItems() {
  const items = document.querySelectorAll(".detailItem");
  if (items.length > 0) {
    items.forEach(function (item) {
      detailTable.removeChild(item);
    });
  }
  reset();
  localStorage.removeItem("detailTable");
}
function clearSumTable(){
  total.innerHTML="";
  const categorySum = document.querySelectorAll(`td>span`);
  categorySum.forEach(span=>{
    span.innerHTML="";
  })
}
// local storage--------------------------------------------------------------------------------------------------------------------------------------------------------------------
//get everything to lacal storage from detail table
function getLocalStorage(){
    return localStorage.getItem("detailTable")//get the localStorage access to detailTable
    ?JSON.parse(localStorage.getItem("detailTable"))//if localStorage has the detailTable, then get item
    :[];//else, return an empty list
}
//add new details to local storage
function addToLocalStorage(id,date,category,description,amount){
  const details={id,date,category,description,amount}//declare an item
   let detailTable=getLocalStorage();//get origin data from detailTable
   detailTable.push(details)//add new details to detailTable
   localStorage.setItem("detailTable",JSON.stringify(detailTable))//update details item to localStorage
}
function removeFromLocalStorage(id) {
  let details = getLocalStorage();
  details=details.filter(function (detail) {
    return detail.id !== id;
  });
  localStorage.setItem("detailTable", JSON.stringify(details));
}
function displayDataOnDetailTable(id,date,category,description,amount) {
    const detailRow=document.createElement('tr');
      // add id
      let attr=document.createAttribute("data-id");
      attr.value=id;
      detailRow.setAttributeNode(attr);
      detailRow.innerHTML=
      `<td>${date}</td>
      <td>${category}</td>
      <td>${description}</td>
      <td>${amount}</td>
      <button class="deleteBtn"><i class="fa-regular fa-trash-can"></i></button>`
      //add class
      detailRow.classList.add("detailItem");
      //append child
      detailTable.appendChild(detailRow);
  } 
function setupItems() {
  let items = getLocalStorage();
  if (items.length>0) {
    items.forEach(function (item) {
      displayDataOnDetailTable(item.id,item.date,item.category,item.description,item.amount);
    });
  }
}
function displayDataOnSumTable() {
    const detailData = getLocalStorage(); // retrieve all items from local storage
    let totalSum =0;
    const categorySums = {};

    detailData.forEach(function(detail) {
      const { category, amount } = detail; // extract category and amount from detail
      if (!categorySums[category]) {
        categorySums[category] = 0;
      }
      categorySums[category] += parseInt(amount);
      totalSum += parseInt(amount);
    });
    Object.keys(categorySums).forEach(function(category) {
      const categorySum = document.querySelector(`#${category}+td span`);
      if (categorySums[category]) {
        categorySum.innerHTML = categorySums[category];
      }
    });
    if(totalSum!==0){
      total.innerHTML=totalSum;
    }else{
      total.innerHTML="";
    }  
  }
