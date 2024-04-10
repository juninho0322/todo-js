const $dropDownMenu = document.querySelector(".drop-menu");
const $buttonFilter = document.querySelector(".button-filter");
const $buttonAdd = document.querySelector(".button-add");
const $inputTask = document.querySelector(".js-input-task");
const $tableList = document.querySelector(".js-tablelist");
const $noTask = document.querySelector(".no-task");
const $statusSelected = document.querySelector(".status-selected");
const $statusFiltered = document.querySelectorAll(".status-filtered");

let dropDownMenuVisible = false;

function toggleMenuFilter() {
  if (dropDownMenuVisible) {
    $dropDownMenu.classList.add("invisible");
    $dropDownMenu.classList.remove("visible");
  } else {
    $dropDownMenu.classList.add("visible");
    $dropDownMenu.classList.remove("invisible");
  }

  dropDownMenuVisible = !dropDownMenuVisible;
}

$buttonFilter.addEventListener("click", toggleMenuFilter);

$buttonAdd.addEventListener("click", function () {
  const descr = $inputTask.value;
  if (descr === "") {
    alert("Please type your task");
  } else {
    addItem(descr);
  }
});

const storagedItems = window.localStorage.getItem("Todo-List");
const items = !storagedItems
  ? []
  : JSON.parse(window.localStorage.getItem("Todo-List"));

const statusValues = ["Open", "InProgress", "Done", "All"];

const binImg = ` <img
src="img/bin-garbage-trash-svgrepo-com.svg"
alt="bin"
class="bin max-w-10 p-2"
/>`;

const editImg = ` <img
src="img/edit_icon.svg"
alt="bin"
class="bin max-w-10 p-2"
/>`;

function addItem(descr, date = new Date()) {
  // Get the day, month, and year
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-based, so we add 1
  const year = date.getFullYear();

  // Pad single-digit day and month with leading zeros if necessary
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Format the date as "dd/mm/yy"
  const formattedDate = `${formattedDay}/${formattedMonth}/${year
    .toString()
    .slice(-2)}`;

  const newItem = {
    date: formattedDate,
    descr: descr,
    status: statusValues[0],
  };

  $statusSelected.innerHTML = "All";
  items.push(newItem);
  renderList(items);
  console.log(items);
}

function filterByStatus(filter) {
  if (filter === "All") {
    toggleMenuFilter();
    $statusSelected.innerHTML = "All";
    renderList(items);
    return;
  } else {
    $statusSelected.innerHTML = filter;
  }

  // rewrite the filter using forEach
  const filtered = items.filter((currentItem) => currentItem.status === filter);
  toggleMenuFilter();
  renderList(filtered);
}

$statusFiltered.forEach((button) => {
  button.addEventListener("click", function () {
    const filter = this.getAttribute("data-filter");
    filterByStatus(filter);
  });
});

function removeItem(index) {
  if (confirm(`Delete the task ${items[index].descr}?`)) {
    items.splice(index, 1);
  }
  if (items.length === 0) {
    $noTask.classList.remove("hidden");
  }

  renderList(items);
}

function editItem(index) {
  const newDescr = prompt(`add new description to ${items[index].descr} task`);
  if (newDescr === null) {
    console.log("if");
  } else if (newDescr === "") {
    alert("Can't be empty");
    console.log("if");
  } else {
    items[index].descr = newDescr;
    renderList(items);
    console.log("else");
  }
}

function changeStatus(index, value) {
  if (confirm(`Change the task ${items[index].descr} to status ${value} ?`)) {
    items[index].status = value;
  }

  renderList(items);
}

function renderList(items) {
  if (items.length === 0) {
    $noTask.classList.add("visible");
  } else {
    $noTask.classList.add("hidden");
  }

  window.localStorage.setItem("Todo-List", JSON.stringify(items));

  let result = "";

  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];
    console.log(currentItem);
    // make the rows bg-gray-500 or 300
    result += getTemplate(
      currentItem.date,
      currentItem.descr,
      currentItem.status,
      i
    );
  }

  if (items.length === 0) {
    $noTask.classList.add("visible");
  }

  $tableList.innerHTML = result;
  $inputTask.value = "";
}

function getTemplate(date, descr, status, index) {
  console.log(status);
  const optionOpen =
    status === statusValues[0]
      ? `<option value="${statusValues[0]}" selected>
      Open
    </option>`
      : `<option value=${statusValues[0]}>Open</option>`;

  const optionInProgress =
    status === statusValues[1]
      ? `<option value="${statusValues[1]}" selected>
      In Progress
    </option>`
      : `<option value=${statusValues[1]}>In Progress</option>`;

  const optionDone =
    status === statusValues[2]
      ? `<option value="${statusValues[2]}" selected>
      Done
    </option>`
      : `<option value=${statusValues[2]}>Done</option>`;

  return `<tr class="bg-gray-${
    index % 2 === 0 ? 500 : 400
  }" data-index="${index}">
       <td class="inline w-1/5 hidden sm:table-cell">${date}</td>
       <td class="max-sm:pl-2">${descr}</td>
       <td><select name="status" value="${status}" class="bg-transparent" onchange="changeStatus(${index}, value);" >
         ${optionOpen}
         ${optionInProgress}
         ${optionDone}
     </select></td>
         <td class="gap-1 max-w-10 text-center">
         <button class="buttonEdit" onclick="editItem(${index});">${editImg}</button>
         <button class="buttonDel" onclick="removeItem(${index});">${binImg}</button>
         </td>
   </tr>`;
}

renderList(items);
