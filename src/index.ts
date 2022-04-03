import User from "@schema/User";

const main = async () => {
  const user = new User("cheatslife", "Cm96mYE7v6yP");
  await user.setCsrf();
  await user.setLogin();
  console.log(user);
};
main();
