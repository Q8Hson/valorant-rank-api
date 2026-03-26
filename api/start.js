import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const name = "Q8Hson";
  const tag = "1029";
  const apiKey = process.env.HENRIK_API_KEY;

  try {
    const accountRes = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`,
      {
        headers: { Authorization: apiKey }
      }
    );

    const accountData = await accountRes.json();

    if (!accountData || !accountData.data || !accountData.data.region) {
      return res.status(500).send("Account API failed");
    }

    const region = accountData.data.region;

    const mmrRes = await fetch(
      `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${name}/${tag}`,
      {
        headers: { Authorization: apiKey }
      }
    );

    const data = await mmrRes.json();

    if (!data || !data.data || !data.data.current_data) {
      return res.status(500).send("MMR API failed");
    }

    const rr = data.data.current_data.ranking_in_tier;

    await redis.set("start_rr", rr);
    await redis.set("wins", 0);
    await redis.set("losses", 0);

    res.status(200).send("Session started");
  } catch (err) {
    res.status(500).send("Error starting session");
  }
}
