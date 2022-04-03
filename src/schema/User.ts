import { CookieJar } from "tough-cookie";
import { promisify } from "node:util";
import { csrf, login } from "@auth/login";
import { auth, place } from "@place";
import { queue } from "@root";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export default class User {
  cookieJar = new CookieJar();
  setCookie = promisify(this.cookieJar.setCookie.bind(this.cookieJar));

  username: string;
  password: string;
  accessToken: string = "";
  csrfToken: string = "";
  loggedIn: boolean = false;
  nextPlace: string = "";

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  setCsrf = async () => {
    const token = await csrf(this.cookieJar);
    this.csrfToken = token;
    return token;
  };

  setAccessToken = async () => {
    const token = await auth(this.cookieJar);
    this.accessToken = token;
    return token;
  };

  setLogin = async () => {
    await login(this);
  };

  place = async (x: number, y: number, color: number) => {
    this.nextPlace = await place(x, y, color, this);
    queue.addUserEvent(this);
  };

  start = async () => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        await this.setCsrf();
        await this.setLogin();
        await this.setAccessToken();
        await this.place(1490, 451, 31);
        return 0;
      } catch (err) {
        console.log(err);
        console.log(`(${attempts++})Retrying...`);
        await sleep(2000);
      }
    }
    if (attempts >= 3) {
      console.log(`${this.username} failed to start user.`);
    }
  };
}
