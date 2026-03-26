import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    let wins = (await redis.get("wins")) || 0;
    wins++;

    await redis.set("wins", wins);

    res.status(200).send("Win added");
  } catch (error) {
    res.status(200).send("Error adding win");
  }
}
