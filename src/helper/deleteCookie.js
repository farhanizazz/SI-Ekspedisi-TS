export function deleteCookie(name) {
    let cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    cookie += "; path=/";
    cookie += `; domain=${window.location.hostname}`;
    cookie += "; secure";
    document.cookie = cookie;
  }