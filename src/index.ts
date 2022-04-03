import User from "@schema/User";
import Manager from "@manager";
export const queue = new Manager();

const main = async () => {
  queue.start_q();
  queue.addUser(new User("cheatslife", "Cm96mYE7v6yP"));
};
main();
