/* The type of the file is mjs, because I am using
node-fetch and it is only imported, and that is available
only in modules, so it is .mjs, not js.
Also i use createRequire to be able to 
require fs and util
*/

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
import fetch from "node-fetch";
const util = require("util");
async function fetchData(URL) {
  let response = await fetch(URL);
  let data = await response.json();
  return data;
}

let users = await fetchData("http://jsonplaceholder.typicode.com/users");
let posts = await fetchData("http://jsonplaceholder.typicode.com/posts");

let id = users.find((x) => x.name == "Ervin Howell").id;

for (let i = 0; i <= posts.length - 1; i++) {
  if (posts[i].userId === id) {
    let comments = await fetchData(
      `http://jsonplaceholder.typicode.com/posts/${posts[i].id}/comments`
    );
    posts[i].comments = comments;
  }
}

function getPostsById(userId, postArray) {
  let posts = [];
  for (let el of postArray) {
    let post = {};
    if (el.userId === userId) {
      post.id = el.id;
      post.title = el.title;
      post.title_crop = `${el.title.slice(0, 19)}...`;
      post.body = el.body;
      if (el.hasOwnProperty("comments")) {
        post.comments = el.comments;
      }
      posts.push(post);
    }
  }
  return posts;
}

function makeUser(usersArray, postArray) {
  let newUserArray = [];
  for (let el of usersArray) {
    let user = {};
    user.id = el.id;
    user.name = el.name;
    user.email = el.email;
    user.address = `${el.address.city}, ${el.address.street}, ${el.address.suite}`;
    user.website = `https://${el.website}`;
    user.company = el.company.name;
    user.posts = getPostsById(el.id, postArray);
    newUserArray.push(user);
  }
  return newUserArray;
}

console.log(util.inspect(makeUser(users, posts), false, 5));

let data = JSON.stringify(makeUser(users, posts), null, 2);

// write JSON string to a file
fs.writeFile("userData.json", data, (err) => {
  if (err) {
    throw err;
  }
  console.log("JSON data is saved.");
});
