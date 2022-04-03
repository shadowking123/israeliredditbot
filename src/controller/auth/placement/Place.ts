import User from "@schema/User";
import got from "got";

// const COLOR_INDEX = {
//   "#BE0039": 1,
//   "#FF4500": 2,
//   "#FFA800": 3,
//   "#FFD635": 4,
//   "#00A368": 6,
//   "#00CC78": 7,
//   "#7EED56": 8,
//   "#00756F": 9,
//   "#009EAA": 10,
//   "#2450A4": 12,
//   "#3690EA": 13,
//   "#51E9F4": 14,
//   "#493AC1": 15,
//   "#6A5CFF": 16,
//   "#811E9F": 18,
//   "#B44AC0": 19,
//   "#FF3881": 22,
//   "#FF99AA": 23,
//   "#6D482F": 24,
//   "#9C6926": 25,
//   "#000000": 27,
//   "#898D90": 29,
//   "#D4D7D9": 30,
//   "#FFFFFF": 31,
// };
// const NAME_INDEX = {
//   "Dark Red": 1,
//   "Bright Red": 2,
//   Orange: 3,
//   Yellow: 4,
//   "Dark Green": 6,
//   Green: 7,
//   "Light Green": 8,
//   "Dark Teal": 9,
//   Teal: 10,
//   "Dark Blue": 12,
//   Blue: 13,
//   "Light Blue": 14,
//   Indigo: 15,
//   Periwinkle: 16,
//   "Dark Purple": 18,
//   Purple: 19,
//   Pink: 22,
//   "Light Pink": 23,
//   "Dark Brown": 24,
//   Brown: 25,
//   Black: 27,
//   Gray: 29,
//   "Light Gray": 30,
//   White: 31,
// };
export const place = async (
  x: number,
  y: number,
  color: number,
  user: User
) => {
  let canvasIndex: number = Math.floor(x / 1000);
  x -= canvasIndex * 1000;
  if (y >= 1000) {
    canvasIndex += Math.ceil(y / 1000);
    y -= Math.floor(y / 1000) * 1000;
  }
  const url = `${process.env.REDDIT_PLACE}/query`;
  const client = got.extend({
    hooks: {
      beforeRequest: [
        (options) => {
          if (typeof user.accessToken !== "string") {
            throw new Error("Token required");
          }
          options.headers.Authorization = `Bearer ${user.accessToken}`;
        },
      ],
    },
  });

  const body = {
    operationName: "setPixel",
    variables: {
      input: {
        actionName: "r/replace:set_pixel",
        PixelMessageData: {
          coordinate: { x: x, y: y },
          colorIndex: color,
          canvasIndex: canvasIndex,
        },
      },
    },
    query:
      "mutation setPixel($input: ActInput!) {\n  act(input: $input) {\n    data {\n      ... on BasicMessage {\n        id\n        data {\n          ... on GetUserCooldownResponseMessageData {\n            nextAvailablePixelTimestamp\n            __typename\n          }\n          ... on SetPixelResponseMessageData {\n            timestamp\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
  };

  const res: any = await client.post(url, { json: body }).json();
  if (res && res.data && res.data.act && res.data.act.data) {
    console.log(`${user.username} (${x},${y},${canvasIndex}): ${color}`);
    const data = res.data.act.data;
    const nextPlace = data[0].data.nextAvailablePixelTimestamp;
    return nextPlace;
  } else if (res && res.errors[1]) {
    const error = res.errors[1].message;
    const nextPlace = error.match(/\d+/)[0];
    return nextPlace;
  } else {
    console.log(res);
    throw Error("Oops something went wrong while placing a pixel.\n" + res);
  }
};
