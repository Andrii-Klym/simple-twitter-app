const root = document.getElementById('root');
root.classList.add('flex');

let tweetItems = document.getElementById('tweetItems'),
  modifyItem = document.getElementById('modifyItem'),
  addTweetButton = document.querySelector('.addTweet'),
  saveModifiedItem = document.getElementById('saveModifiedItem'),
  textArea = document.getElementById('modifyItemInput'),
  list = document.getElementById('list'),
  navigationButtons = document.getElementById('navigationButtons'),
  h1 = document.getElementsByTagName('h1')[0],
  modifyItemHeader = document.getElementById('modifyItemHeader'),
  cancelModification = document.getElementById('cancelModification');

root.classList.add('flex');

const backButton = document.createElement('button');
backButton.classList.add('back');
backButton.classList.add('hidden');
backButton.innerText = 'back';
navigationButtons.appendChild(backButton);

const likedButton = document.createElement('button');
likedButton.innerText = 'Go to liked';
showLikedButton();

navigationButtons.appendChild(likedButton);

cancelModification.addEventListener('click', () => {
  mainPage();
  textArea.value = '';
});

function showLikedButton() {
  const show = Object.keys(localStorage).some(function (key) {
    let obj = localStorage.getItem(key);
    obj = JSON.parse(obj);
    const isLiked = obj.liked;
    return isLiked;
  });
  show ? likedButton.classList.remove('hidden') : likedButton.classList.add('hidden');
}

function mainPage() {
  const tweetLi = document.querySelectorAll('.tweetLi');
  tweetLi.forEach((div) => {
    div.classList.remove('hidden');
  });
  tweetItems.classList.remove('hidden');
  modifyItem.classList.add('hidden');
  history.pushState({
    link: 'mainPage'
  }, null, '');
}

function newTweet() {
  modifyItemHeader.innerText = 'New Tweet';
  const tweetLi = document.querySelectorAll('.tweetLi');
  tweetItems.classList.add('hidden');
  modifyItem.classList.remove('hidden');
  tweetLi.forEach((div) => {
    div.classList.add('hidden');
  });
  history.pushState({
    link: 'add'
  }, null, '#add');
}

function editTweet(id) {
  modifyItemHeader.innerText = 'Edit Tweet';
  const tweetLi = document.querySelectorAll('.tweetLi');
  tweetItems.classList.add('hidden');
  modifyItem.classList.remove('hidden');
  modifyItem.classList.add('flex');
  tweetLi.forEach((div) => {
    div.classList.add('hidden');
  });
  history.pushState({
    link: 'edit'
  }, null, '#edit/' + id);
}

addTweetButton.addEventListener('click', newTweet);

window.addEventListener('popstate', (e) => {
  if (e.state.link === 'mainPage') {
    tweetItems.classList.remove('hidden');
    modifyItem.classList.add('hidden');
  }
  if (e.state.link === 'add') {
    tweetItems.classList.add('hidden');
    modifyItem.classList.remove('hidden');
    modifyItem.classList.add('flex');
  }
});

function showTweets() {
  Object.keys(localStorage)
    .sort(function (a, b) {
      return Number(a) - Number(b);
    })
    .forEach(function (key, i) {
      let obj = localStorage.getItem(key);
      obj = JSON.parse(obj);
      const text = obj.text;
      const isLiked = obj.liked;
      const id = i;
      if (obj.hidden) {
        return;
      }
      displayNewTweet(text, id, isLiked);
    });
}

window.onload = () => history.replaceState({
  link: 'mainPage'
}, null, '');
window.onload = () => showTweets();

function saveTweet(id) {
  const maxLength = 140;
  const text = textArea.value;
  if (text.length === 0) {
    return;
  }
  if (text.length > maxLength) {
    return;
  }
  let isSame = false;
  Object.keys(localStorage).forEach((key) => {
    let obj = localStorage.getItem(key);
    obj = JSON.parse(obj);
    const oldText = obj.text;
    if (oldText === text) {
      modalAlert('same', id);
      isSame = true;
    }
  });
  if (isSame) {
    return;
  }
  const value = {
    text: text,
    liked: false,
    id: id
  };
  localStorage.setItem(id, JSON.stringify(value));
  textArea.value = '';
}

function displayNewTweet(text, id, isLiked = false) {
  const tweetLi = document.createElement('li');
  tweetLi.classList.add('tweetLi');
  tweetLi.classList.add('tweetLi-' + id);
  
  const tweetText = document.createElement('p');
  tweetText.classList.add('edit-' + id);
  tweetText.innerText = text;
  tweetText.addEventListener('click', () => edit(id));

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-' + id);
  removeButton.innerText = 'remove';
  removeButton.addEventListener('click', () => remove(id));

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-' + id);
  likeButton.innerText = isLiked ? 'unlike' : 'like';
  likeButton.addEventListener('click', () => like(id));
  tweetLi.appendChild(tweetText);
  tweetLi.appendChild(removeButton);
  tweetLi.appendChild(likeButton);
  list.appendChild(tweetLi);
}

saveModifiedItem.addEventListener('click', function () {
  let hash = window.location.hash;
  hash = hash.split('/')[1];
  let id;
  if (hash) {
    id = hash;
  } else {
    id = localStorage.length;
  }
  saveTweet(id);
  list.innerHTML = '';
  showTweets();
  mainPage();
});

function like(id) {
  const tweetString = localStorage.getItem(id);
  const tweetObject = JSON.parse(tweetString);
  const isLiked = !tweetObject.liked;
  tweetObject.liked = isLiked;
  const likeButton = document.querySelector('.like-' + id);
  localStorage.setItem(id, JSON.stringify(tweetObject));
  likeButton.innerText = isLiked ? 'unlike' : 'like';
  modalAlert(isLiked, id);
  showLikedButton();
}

function edit(id) {
  editTweet(id);
  const tweetString = localStorage.getItem(id);
  const tweetObject = JSON.parse(tweetString);
  const tweetText = tweetObject.text;
  textArea.value = tweetText;
}

function remove(id) {
  const tweetLi = document.querySelector('.tweetLi-' + id);
  const value = {
    text: '',
    liked: false,
    id: id,
    hidden: true
  };
  localStorage.setItem(id, JSON.stringify(value));
  tweetLi.classList.add('hidden');
}

likedButton.addEventListener('click', displayLikedPage);

function displayLikedPage() {
  likedButton.classList.add('hidden');
  addTweetButton.classList.add('hidden');
  h1.innerText = 'Liked Tweets';
  list.innerHTML = '';
  backButton.classList.remove('hidden');
  backButton.addEventListener('click', () => {
    h1.innerText = 'Simple Twitter';
    list.innerHTML = '';
    backButton.classList.add('hidden');
    likedButton.classList.remove('hidden');
    addTweetButton.classList.remove('hidden');
    showTweets();
  });
  showLikedTweets();
  history.pushState({
    link: 'liked'
  }, null, '#liked');
}

function showLikedTweets() {
  Object.keys(localStorage)
    .sort(function (a, b) {
      return Number(a) - Number(b);
    })
    .forEach(function (key, i) {
      let obj = localStorage.getItem(key);
      obj = JSON.parse(obj);
      const text = obj.text;
      const isLiked = obj.liked;
      const id = i;
      if (obj.hidden) {
        return;
      }
      if (!obj.liked) {
        return;
      }
      displayNewTweet(text, id, isLiked);
    });
}

function modalAlert(why, id) {
  const timeOut = 2000;
  const message = document.createElement('div');
  root.appendChild(message);
  message.classList.add('modalAlert');
  if (why === 'same') {
    message.innerText = 'Error! You cannot tweet about that';
  }
  if (why === true) {
    message.innerText = `Hooray, You liked tweet with id ${id}`;
  }
  if (why === false) {
    message.innerText = `Sorry you no longer like tweet with id ${id}`;
  }

  setTimeout(() => {
    root.removeChild(message);
  }, timeOut);
}
