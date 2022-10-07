let STUDENTS_API = "http://localhost:8000/students";

//add info to server
let name = document.querySelector("#name-inp");
let surname = document.querySelector("#surname-inp");
let number = document.querySelector("#number-inp");
let wKpi = document.querySelector("#wKpi-inp");
let mKpi = document.querySelector("#mKpi-inp");
let addbtn = document.querySelector("#add-btn");

function addToServer() {
  let obj = {
    name: name.value,
    surname: surname.value,
    number: number.value,
    wKpi: wKpi.value,
    mKpi: mKpi.value,
  };

  fetch(STUDENTS_API, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });

  name.value = "";
  surname.value = "";
  number.value = "";
  wKpi.value = "";
  mKpi.value = "";
}

addbtn.addEventListener("click", addToServer);
let container3 = document.querySelector(".container-3");
//&_page=&_limit=1
let currentPage = 1;
let search = "";
let category = "";
async function takeInfo(search = "") {
  container3.innerHTML = "";
  let res = await fetch(
    `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=3  `
  );
  let data = await res.json();
  data.forEach(item => {
    container3.innerHTML += `<div class="card bg-secondary" style="width: 18rem" id="#">
    <img
      src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
      class="card-img-top"
      alt="..."
    />
    <div class="card-body">
      <h5 class="card-title"><b>Name</b>:${item.name}</h5>
      <p class="card-text"><b>Surname</b>:${item.surname}</p>
      <p class="card-text"><b>Phone number</b>:${item.number}</p>
      <p class="card-text"><b>Week KPI</b>:${item.wKpi}</p>
      <p class="card-text"><b>Month KPI</b>:${item.mKpi}</p>
      <a href="#" class="btn btn-danger del-btn" id=${item.id}>Delete</a>
      <a href="#" class="btn btn-success update-btn" id="${item.id}" data-bs-target="#exampleModal" data-bs-toggle="modal" >Update</a>
    </div>
  </div>`;
  });
  addEventDelete();
  addInfotoInputesEvent();
  // takeInfo();
}
takeInfo();

//delete
function addEventDelete() {
  let delBtn = document.querySelectorAll(".del-btn");
  delBtn.forEach(item => {
    item.addEventListener("click", deleteBio);
  });
}
async function deleteBio(e) {
  // e.preventDefault();
  let productId = e.target.id;
  // console.log(e);
  fetch(`${STUDENTS_API}/${productId}`, {
    method: "DELETE",
  });
  takeInfo();
}

//update
let savebtn = document.querySelector("#save-btn");
function addInfotoInputesEvent() {
  let updateBtn = document.querySelectorAll(".update-btn");
  updateBtn.forEach(item => item.addEventListener("click", addInfotoInputes));
}

async function addInfotoInputes(e) {
  let productId = e.target.id;
  let res = await fetch(`${STUDENTS_API}/${productId}`);
  let data = await res.json();
  savebtn.id = productId;
  name.value = data.name;
  surname.value = data.surname;
  number.value = data.number;
  wKpi.value = data.wKpi;
  mKpi.value = data.mKpi;
}

async function saveChanges(e) {
  let productId = e.target.id;
  let newObj = {
    name: name.value,
    surname: surname.value,
    number: number.value,
    wKpi: wKpi.value,
    mKpi: mKpi.value,
  };
  await fetch(`${STUDENTS_API}/${productId}`, {
    method: "PUT",
    body: JSON.stringify(newObj),
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });
  name.value = "";
  surname.value = "";
  number.value = "";
  wKpi.value = "";
  mKpi.value = "";

  takeInfo();
}
savebtn.addEventListener("click", saveChanges);

//search

let bioSearch = document.querySelector("#bio-search");
bioSearch.addEventListener("input", e => {
  takeInfo(e.target.value.toLowerCase());
});

//pagination
let nextPage = document.querySelector("#next-page");
let prevPage = document.querySelector("#prev-page");

async function checkPages() {
  let res = await fetch(STUDENTS_API);
  let data = await res.json();
  let pages = Math.ceil(data.length / 3);

  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    prevPage.style.display = "block";
    nextPage.style.display = "none";
  } else {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
  }
}
checkPages();

nextPage.addEventListener("click", () => {
  currentPage++;
  takeInfo();
  checkPages();
});

prevPage.addEventListener("click", () => {
  currentPage--;
  takeInfo();
  checkPages();
});
