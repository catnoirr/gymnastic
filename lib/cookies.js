export function setCookie(name, value, options = {}) {
  let cookie = `${name}=${value}`;
  
  if (options.expires) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  }
  
  if (options.path) {
    cookie += `; path=${options.path}`;
  }
  
  if (options.secure) {
    cookie += '; secure';
  }
  
  if (options.sameSite) {
    cookie += `; samesite=${options.sameSite}`;
  }
  
  document.cookie = cookie;
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
} 