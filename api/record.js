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

    const currentRR = data.data.current_data.ranking_in_tier;
    const rank = data.data.current_data.currenttierpatched;

    const startRR = (await redis.get("start_rr")) ?? currentRR;
    const wins = (await redis.get("wins")) ?? 0;
    const losses = (await redis.get("losses")) ?? 0;

    const rrGain = currentRR - startRR;
    const total = wins + losses;
    const wr = total > 0 ? ((wins / total) * 100).toFixed(2) : "0.00";

    res.setHeader("Content-Type", "text/plain");
    res
      .status(200)
      .send(
        `${rrGain}RR (Going: ${wins}W - ${losses}L, ${wr}% WR) | Current: ${rank} ${currentRR}RR`
      );
  } catch (error) {
    res.status(200).send("Error fetching record");
  }
}
