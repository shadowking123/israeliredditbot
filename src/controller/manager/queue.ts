import User from "@schema/User";
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default class Queue {
  queue = new Map<string, Array<User>>();

  start_q = async () => {
    while (true) {
      const date = Date.now();
      this.queue.forEach((v: Array<User>, k: string) => {
        const eventDate = new Date(parseInt(k));
        if (date - eventDate.getTime() >= 0) {
          v.forEach(async (user: User) => {
            user.place(1490, 451, 31);
            console.log(
              `removed ${user.username} from queue (${user.nextPlace})`
            );
            v.splice(v.indexOf(user), 1);
          });
        }
      });
      await sleep(5000);
    }
  };

  addUserEvent = (user: User) => {
    if (user.nextPlace) {
      if (this.queue.has(user.nextPlace)) {
        const users = this.queue.get(user.nextPlace);
        if (users) {
          console.log(`Added ${user.username} to queue (${user.nextPlace})`);
          users.push(user);
        }
      } else {
        const users: User[] = [user];
        console.log(`Added ${user.username} to queue (${user.nextPlace})`);
        this.queue.set(user.nextPlace, users);
      }
    } else {
      throw Error("incorrect posix time.");
    }
  };

  addUser = (user: User) => {
    user.start();
  };
}
