export default async function handler(req, res) {
  const name = "Q8Hson";
  const tag = "1029";
  const apiKey = process.env.HENRIK_API_KEY;

  try {
    const accountRes = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`, {
      headers: { Authorization: apiKey }
    });
    const accountData = await accountRes.json();
    const region = accountData.data.region;

    const mmrRes = await fetch(`https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${name}/${tag}`, {
      headers: { Authorization: apiKey }
    });
    const mmrData = await mmrRes.json();

    const tier = mmrData.data.current_data.currenttierpatched;
    const rr = mmrData.data.current_data.ranking_in_tier;

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(`${tier} ${rr}RR`);
  } catch {
    res.status(200).send("Rank unavailable");
  }
}
