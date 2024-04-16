export function deleteCookie(name) {
    let cookie = name + "=; Max-Age=-99999999";
    document.cookie = cookie;
    console.log("Cookie deleted", cookie);
  }