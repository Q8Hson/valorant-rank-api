import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    let losses = (await redis.get("losses")) || 0;
    losses++;

    await redis.set("losses", losses);

    res.status(200).send("Loss added");
  } catch (error) {
    res.status(200).send("Error adding loss");
  }
}
