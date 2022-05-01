
var goodColor = "#66cc66";
var badColor = "#FF9494";
var okUser = false;
var okPass = false;

function checkCompleted() {
  var submitButton = document.getElementById('submitButton');
  if (okUser && okPass) {
    // enbale submit button
    submitButton.className = "enabled";
    submitButton.style.cursor = "pointer";
    submitButton.disabled = false;

  } else {
    submitButton.disabled = true;
    submitButton.classList.remove("enabled");
  }
}


async function checkUsername() {
  var message = document.getElementById('error-nwl');
  message.style.color = badColor;
  var username = document.getElementById('username');

  let usersArray = [];
  userstoArray(usersArray);

  const upper = usersArray.map(element => {
    return element.toUpperCase();
  });


  const match = upper.includes(username.value.toUpperCase());


  if (username.value.length < 3) {
    message.innerHTML = "Username should be at least 3 characters"
    username.style.borderBottom = `1px solid ${badColor}`;
    okUser = false;
    checkCompleted();
  } else {
    message.innerHTML = ""
    username.style.borderBottom = `1px solid ${goodColor}`;
    okUser = false;
    checkCompleted();
  }
  if (/[^a-z]/i.test(username.value)) {
    message.innerHTML = "Username can not include other than letters"
    username.style.borderBottom = `1px solid ${badColor}`;
    okUser = false;
    checkCompleted();
  }
  if (match) {
    message.innerHTML = `${username.value} already exists.`
    username.style.borderBottom = `1px solid ${badColor}`;
    okUser = false;
    checkCompleted();
  }

  if (!match && !/[^a-z]/i.test(username.value) && username.value.length >= 3) {
    username.style.borderBottom = `1px solid ${goodColor}`;
    okUser = true;
    checkCompleted();
  }
  if (username.value.length == 0) {
    message.innerHTML = "Username should be at least 3 characters"
    username.style.borderBottom = `1px solid ${badColor}`;
    okUser = false;
    checkCompleted();
  }

}


function checkPass() {
  var pass1 = document.getElementById('pass1');
  var pass2 = document.getElementById('pass2');
  var message = document.getElementById('error-nwl');

  if (pass1.value.length > 6) {
    pass1.style.borderBottom = `1px solid ${goodColor}`;
  }
  else {
    pass1.style.borderBottom = `1px solid ${badColor}`;
    message.style.color = badColor;
    message.innerHTML = " Password should be at least 6 characters long"
    return;
  }

  if (pass1.value == pass2.value) {
    pass2.style.borderBottom = `1px solid ${goodColor}`;
    message.style.color = goodColor;
    message.innerHTML = ""
    okPass = true;
    checkCompleted();
  }
  else {
    pass2.style.borderBottom = `1px solid ${badColor}`;
    message.style.color = badColor;
    message.innerHTML = " These passwords don't match"
    okPass = false;
    checkCompleted();
  }

}

function userstoArray(usersArray) {
  var getUsers = document.getElementById('users').innerHTML.replace(/\s/g, '');
  var users = {
    name: getUsers.replace(/,$/, "").split(",").map(function (name) {
      return { name: name };
    })
  };

  for (var i = 0; i < users.name.length; i++) {
    let s = users.name[i].name;
    if (s[i] < 'A' || s[i] > 'Z' &&
      s[i] < 'a' || s[i] > 'z') {

      // erase function to erase
      // the character
      s = s.substring(0, i) + s.substring(i + 1);

    }
    usersArray.push(s)

  }
}


jQuery(document).ready(function () {
  jQuery('.toast__close').click(function (e) {
    e.preventDefault();
    var parent = $(this).parent('.toast');
    parent.fadeOut("slow", function () { $(this).remove(); });
  });
});