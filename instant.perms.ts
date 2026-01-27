export default {
  "$files": {
    "allow": {
      "view": "true",
      "create": "isLoggedIn",
      "delete": "isLoggedIn",
    },
    "bind": ["isLoggedIn", "auth.id != null"]
  }
};
