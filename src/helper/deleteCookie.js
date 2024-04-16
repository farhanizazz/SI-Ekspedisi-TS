export function deleteCookie(name) {
  let cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    console.log("cookie", cookie);
    cookie += "; path=/";
    cookie += `; domain=sisteminformasi.pancurmas.com`;
    cookie += "; secure";
    document.cookie = cookie;
  }