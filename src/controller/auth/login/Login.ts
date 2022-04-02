import ky from "ky";

export const login = async (
  session: string,
  csrf: string,
  username: string,
  password: string
) => {
  let url = `${process.env.REDDIT_URL}/login`;
  let headers = ky.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set("Cookie", `session: ${session};`);
        },
      ],
    },
  });
  let body = {
    csrf_token: csrf,
    otp: "",
    password: password,
    username: username,
  };

  return await headers.post(url, body).then((res) => {
    console.log(res);
  });
};
