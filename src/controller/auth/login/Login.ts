import User from "@schema/User";
import got from "got";

export const login = async (user: User) => {
  const cookieJar = user.cookieJar;
  const url = `${process.env.REDDIT_URL}/login`;
  const client = got.extend({ cookieJar });
  const body = {
    csrf_token: user.csrfToken,
    otp: "",
    password: user.password,
    username: user.username,
  };

  const res = await client.post(url, { form: body });
};
