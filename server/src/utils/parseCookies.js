export const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, ...rest] = cookie.split('=');
    if (!name) return cookies;
    const value = rest.join('=').trim();
    cookies[name.trim()] = decodeURIComponent(value);
    return cookies;
  }, {});
};
