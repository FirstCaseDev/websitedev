function search() {
  // Declare variables
  var input, filter, users, title, category, desc, age, country, i, txtValue;
  input = document.getElementsByClassName("myInput");
  filter = input.value;
  users = document.getElementsByClassName("search-repeater");
  title = document.getElementsByName("search-title");
  category = document.getElementsByName("search-category");
  desc = document.getElementsByName("search-desc");
  age = document.getElementsByName("search-age");
  country = document.getElementsByName("search-country");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < users.length; i++) {
    txtValue = category[i].textContent;
    if (txtValue.indexOf(filter) > -1) {
      users[i].style.display = "";
    } else {
      users[i].style.display = "none";
    }
  }
}
