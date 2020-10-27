
const dataPanel = document.querySelector("#data-panel")

let users = JSON.parse(localStorage.getItem('bestFriend'));
let filteredName = [];



function renderUserList(data) {
  let rawHTML = ''; //style 為了讓圖片置中
  data.forEach((item) => {
    rawHTML += `<div class="col-lg-3">
        <div class="mb-4">
        <div class="card">
        <div style="width:100%; text-align:center"> 
          <img class="user-avatar" src="${item.avatar}" type="button" alt="Card image cap" class="btn btn-primary" data-toggle="modal" data-target="#userModal" data-id="${item.id}" id="icon">      
        </div>
      
  <div class="user-body">
    <h5 class="user-name">${item.name}</>
  </div>
  <div class="user-footer">
    <button class="btn btn-info btn-remove-favorite" data-id="${item.id}">x</button>
  </div>
</div>
</div></div>`
  })
  dataPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  const userName = document.querySelector("#user-name");
  const userImage = document.querySelector("#user-image");
  const userSurname = document.querySelector("#user-surname");
  const userEmail = document.querySelector("#user-email");
  const userGender = document.querySelector("#user-gender");
  const userAge = document.querySelector("#user-age");
  const userRegion = document.querySelector("#user-region");
  const userBirthday = document.querySelector("#user-birthday");
  axios.get(index_URL + id).then((response) => {
    const data = response.data;
    userName.innerText = data.name;
    userSurname.innerText = "Surname: " + data.surname;
    userEmail.innerText = "Email: " + data.email;
    userGender.innerText = "Gender: " + data.gender;
    userAge.innerText = "Age: " + data.age;
    userRegion.innerText = "Region: " + data.region;
    userBirthday.innerText = "Birthday: " + data.birthday;
    userImage.innerHTML = `<img src="${data.avatar}" alt="" class="img-thumbnail">`;
  });
}

function removeFormFavorite(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  userTagPage(users)
  let userIndexPage = users[userIndex].page
  users.splice(userIndex, 1);
  localStorage.setItem('bestFriend', JSON.stringify(users))
  renderPaginator(users.length)
  renderUserList(getUsersByPage(userIndexPage))
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".user-avatar")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFormFavorite(Number(event.target.dataset.id))
  }
});


const searchForm = document.querySelector('#search-form')
//監聽表單提交事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  console.log('click!') //測試用
});

const searchInput = document.querySelector('#search-input') //新增這裡
//...
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  //新增以下
  const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  //let filteredName = []

  for (const user of users) {
    if (user.name.toLowerCase().includes(keyword)) {
      filteredName.push(user)
    }
  }
  //錯誤處理：無符合條件的結果
  if (filteredName.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人名`)
  }
  renderPaginator(filteredName.length)  //新增這裡
  //預設顯示第 1 頁的搜尋結果
  renderUserList(getUsersByPage(1))
  //renderUserList(filteredName)
})

const USERS_PER_PAGE = 12

function getUsersByPage(page) {
  //計算起始 index 
  const data = filteredName.length ? filteredName : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

const paginator = document.querySelector("#paginator")
function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  //製作 template 
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}

function userTagPage(users) {
  for (let i = 0; i < users.length; i++) {
    if (i === 0) {
      users[0].page = 1
    } else {
      users[i].page = Math.ceil((i / USERS_PER_PAGE))
    }
  }
  return users
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  const page = event.target.dataset.page;
  renderUserList(getUsersByPage(page))
});

renderPaginator(users.length)
renderUserList(getUsersByPage(1))