import got from "got";
import { CookieJar } from "tough-cookie";

export const auth = async (cookieJar: CookieJar) => {
  const url = `${process.env.REDDIT_URL}/r/place/?cx=${process.env.START_X}&cy=${process.env.START_Y}&px=${process.env.PLACE_RANGE}`;
  const client = got.extend({ cookieJar });
  const res = await client.get(url);
  const accessToken = res.body.match(/accessToken":"([a-zA-Z0-9-]+)"/);
  if (accessToken && accessToken[1]) {
    return accessToken[1];
  } else {
    throw Error("Could not fetch access token\n" + res);
  }
};
