const $dropDownMenu = document.querySelector(".drop-menu");
const $buttonFilter = document.querySelector(".button-filter");
const $buttonAdd = document.querySelector(".button-add");
const $inputTask = document.querySelector(".js-input-task");
const $tableList = document.querySelector(".js-tablelist");
const $noTask = document.querySelector(".no-task");

$buttonFilter.addEventListener("click", function () {
  $dropDownMenu.classList.toggle("visible");
  $dropDownMenu.classList.toggle("invisible");
});

$buttonAdd.addEventListener("click", function () {
  const descr = $inputTask.value;
  if (descr === "") {
    alert("Please type your task");
  } else {
    addItem(descr);
  }
});

const items = [];

const statusValues = ["Open", "InProgress", "Done"];

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

function addItem(descr, date = new Date(), status = "Open") {
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
    status: status,
  };

  items.push(newItem);
  renderList(items);
  console.log(items);
}

function filterByStatus(filter) {
  const filtered = items.filter((currentItem) => currentItem.status === filter);
  renderList(filter);
}

function removeItem(index) {
  if (confirm(`do you wanna delete the task ${items[index].descr}?`)) {
    items.splice(index, 1);
  }

  renderList(items);
}

function changeStatus(index, value) {
  if (confirm(`Change the task ${items[index].descr} to status ${value} ?`)) {
    items[index].status = value;
    return;
  }
  renderList(items);
}

function renderList(items) {
  if (items.length === 0) {
    // $tableList.innerHTML = `<tr class="bg-gray-500" > NO TASKS ADD </tr>`;
    $noTask.classList.add("visible");
  } else {
    $noTask.classList.add("hidden");
  }

  let result = "";

  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];

    // make the rows bg-gray-500 or 300
    result += `<tr class="bg-gray-${i % 2 === 0 ? 500 : 400}" data-index="${i}">
        <td class="inline w-1/5 hidden sm:table-cell">${currentItem.date}</td>
        <td >${currentItem.descr}</td>
        <td><select name="status" class="bg-transparent" onchange="changeStatus(${i}, value);" >
          <option value=${statusValues[0]}>Open</option>
          <option value=${statusValues[1]}>In Progress</option>
          <option value=${statusValues[2]}>Done</option>
      </select></td>
          <td class="gap-1 max-w-10 text-center">
          <button class="buttonEdit" onclick="editItem(${i});">${editImg}</button>
          <button class="buttonDel" onclick="removeItem(${i});">${binImg}</button>
          </td>
    </tr>`;
  }

  $tableList.innerHTML = result;
  $inputTask.value = "";
}

renderList(items);
