export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, language } = req.body;

  const systemPrompt = language === "rw"
    ? "Uri umufasha w'ikoranabuhanga ugomba gusubiza mu Kinyarwanda. Fasha abantu kubona serivisi za leta n'izigenga."
    : "You are a smart assistant helping users access Rwandan government and private services.";

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await openaiRes.json();
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}