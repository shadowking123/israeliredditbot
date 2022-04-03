import got from "got";
import { CookieJar } from "tough-cookie";

export const csrf = async (cookieJar: CookieJar) => {
  const url = `${process.env.REDDIT_URL}/login/?experiment_d2x_2020ify_buttons=enabled&experiment_d2x_sso_login_link=enabled&experiment_d2x_google_sso_gis_parity=enabled&experiment_d2x_onboarding=enabled`;
  const res = await got.get(url, { cookieJar });
  const csrf = res.body.match(/csrf_token".value="([a-z0-9]+)"/);
  if (csrf && csrf[1]) {
    return csrf[1];
  } else {
    throw Error("Could not fetch csrf token");
  }
};
