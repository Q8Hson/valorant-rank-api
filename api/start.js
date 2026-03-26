import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const name = "Q8Hson";
  const tag = "1029";
  const apiKey = process.env.HENRIK_API_KEY;

  try {
    const mmrRes = await fetch(
      `https://api.henrikdev.xyz/valorant/v2/mmr/mena/${name}/${tag}`,
      {
        headers: { Authorization: apiKey }
      }
    );

    const data = await mmrRes.json();
    const rr = data.data.current_data.ranking_in_tier;

    await redis.set("start_rr", rr);
    await redis.set("wins", 0);
    await redis.set("losses", 0);

    res.status(200).send("Session started");
  } catch (error) {
    res.status(200).send("Error starting session");
  }
}
