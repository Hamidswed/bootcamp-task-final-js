const getDataBtn = document.querySelector(".btn");
const tableContent = document.querySelector(".table");
const tableContainer = document.querySelector(".table-container");
const searchBar = document.querySelector(".search-bar");
const input = document.querySelector("#search");

let inputText = "";
let sortPrice = "desc";
let sortDate = "desc";

async function getData() {
  const res = await axios.get("http://localhost:3000/transactions");
  const data = await res.data;
  saveToLocal(data);
  return data;
}

function saveToLocal(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

function getLocal() {
  const data = JSON.parse(localStorage.getItem("data"));
  return data;
}

async function sort(sortType) {
  const res = await axios.get(
    `http://localhost:3000/transactions?_sort=${sortType}&_order=${
      sortType === "price" ? sortPrice : sortDate
    }`
  );

  const data = await res.data;

  if (sortType === "price") {
    if (sortPrice === "desc") {
      sortPrice = "asc";
    } else {
      sortPrice = "desc";
    }
  } else if (sortType === "date") {
    if (sortDate === "desc") {
      sortDate = "asc";
    } else {
      sortDate = "desc";
    }
  }

  saveToLocal(data);
  showData();
}

async function serach() {
  const res = await axios.get(
    `http://localhost:3000/transactions?refId_like=${inputText}`
  );
  const data = await res.data;
  saveToLocal(data);
  showData();
  return data;
}

function getInput(e) {
  inputText = e.target.value;
  serach();
}

function createTable(data) {
  let table = "<table>";
  table += `<tr>
    <th>ردیف</th>
    <th>نوع تراکنش</th>
    <th>
    <span class="table-row">
    <span>مبلغ</span>
    <button id="price" class=${sortPrice === "desc" ? "" : "rotate-180"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
    
  </span>
  </th>
    <th>شماره پیگیری</th>
    <th>
    <span class="table-row">
    <span>تاریخ تراکنش</span>
    <button id="date" class=${
      sortDate === "desc" ? "" : "rotate-180"
    }><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
    <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
  </svg></button>
  </span>
  </th>
  </tr>`;

  data.forEach((item) => {
    const style = item.type === "افزایش اعتبار" ? "green" : "red";
    const date = new Date(item.date).toLocaleDateString("fa-IR");
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const time = new Date(item.date).toLocaleTimeString("fa-IR", options);
    table += `<tr>
    <td>${item.id}</td>
    <td class=${style}>${item.type}</td>
    <td>${item.price}</td>
    <td>${item.refId}</td>
    <td>${date} ساعت ${time}</td>
  </tr>`;
  });
  table += "</table>";

  tableContent.innerHTML = table;
  const priceBtn = document.querySelector("#price");
  const dateBtn = document.getElementById("date");

  priceBtn.addEventListener("click", () => sort("price"));
  dateBtn.addEventListener("click", () => sort("date"));

  return table;
}

function showData() {
  const data = getLocal();
  createTable(data);
  getDataBtn.classList.add("hidden");
  searchBar.classList.remove("hidden");
  tableContainer.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", getData);
getDataBtn.addEventListener("click", showData);
input.addEventListener("input", getInput);
