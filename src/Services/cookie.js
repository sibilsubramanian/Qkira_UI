export const setCookie = (name, value, daysToLive) => {
  let cookie = name + "=" + encodeURIComponent(value);
  if (daysToLive) {
    cookie += "; max-age=" + daysToLive * 3 * 60 * 60;
  }
  document.cookie = cookie;
};

export const getCookie = (name) => {
  const cookieArray = document.cookie.split(";");
  for (const cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
};

export const listenCookieChange = (name, callback, interval = 1000) => {
  let previousValue = getCookie(name);
  setInterval(() => {
    let currentValue = document.cookie;
    if (currentValue !== previousValue) {
      try {
        callback({ previousValue, currentValue });
      } finally {
        previousValue = currentValue;
      }
    }
  }, interval);
};
