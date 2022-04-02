import ky from "ky";

export const csrf = async () => {
  const url = `${process.env.REDDIT_URL}/login/?experiment_d2x_2020ify_buttons=enabled&experiment_d2x_sso_login_link=enabled&experiment_d2x_google_sso_gis_parity=enabled&experiment_d2x_onboarding=enabled`;
  await ky.get(url).then((res) => {
    console.log(res);
  });
};
