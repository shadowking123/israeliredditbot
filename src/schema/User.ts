import { CookieJar } from "tough-cookie";
import { promisify } from "node:util";
import { csrf, login } from "@auth/login";

export default class User {
  cookieJar = new CookieJar();
  setCookie = promisify(this.cookieJar.setCookie.bind(this.cookieJar));

  username: string;
  password: string;
  accessToken: string = "";
  csrfToken: string = "";
  loggedIn: boolean = false;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  setCsrf = async () => {
    const token = await csrf(this.cookieJar);
    this.csrfToken = token;
    return token;
  };

  setLogin = async () => {
    await login(this);
  };
}
