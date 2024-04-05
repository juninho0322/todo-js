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

function addItem(descr, date = new Date(), status = "Open") {
  const newItem = {
    date: date.toDateString(),
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
  items.splice(index, 1);
  renderList(items);
}

function changeStatus(index, value) {
  if (confirm(`Change the current status to ${value} ?`)) {
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
        <td>${currentItem.date}</td>
        <td>${currentItem.descr}</td>
        <td><select name="status" class="bg-transparent" onchange="changeStatus(${i}, value);" >
        <option value=${statusValues[0]}>Open</option>
        <option value=${statusValues[1]}>In Progress</option>
        <option value=${statusValues[2]}>Done</option>
    </select></td>
    <td class="flex justify-center"><button class="buttonDel" onclick="removeItem(${i});">${binImg}</button></td>
     </tr>`;
  }

  $tableList.innerHTML = result;
  $inputTask.value = "";
}

renderList(items);