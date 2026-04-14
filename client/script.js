let chart;

async function analyze() {
  const topic = document.getElementById("topic").value;

  if (!topic) return alert("Enter a topic");

  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("dashboard").classList.add("hidden");

  try {
    const res = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();

    document.getElementById("loader").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    process(data); // 🔥 FIXED (pass full data)

  } catch (err) {
    alert("Something went wrong");
    console.error(err);
  }
}

function process(data) {
  const results = data.results;

  let pos = 0, neg = 0, neu = 0;

  results.forEach(r => {
    if (r.sentiment === "positive") pos++;
    else if (r.sentiment === "negative") neg++;
    else neu++;
  });

  // ✅ Sentiment summary
  document.getElementById("summary").innerText =
    `Positive: ${pos} | Negative: ${neg} | Neutral: ${neu}`;

  // 🔥 NEW: AI summary
  document.getElementById("aiSummary").innerHTML = formatSummary(data.summary) || "";

  // 🔥 NEW: Keywords from backend (not recalculated)
  document.getElementById("keywords").innerHTML =
    "<b>Top Keywords:</b> " + (data.keywords?.join(", ") || "N/A");

  drawChart(pos, neg, neu);
  display(results);
}

function drawChart(pos, neg, neu) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [{
        data: [pos, neg, neu]
      }]
    }
  });
}

function display(results) {
  document.getElementById("results").innerHTML =
    results.map(r => `
      <div class="result-item">
        <p>${cleanText(r.text)}</p>
        <span class="${r.sentiment}">
          ${r.sentiment.toUpperCase()} (${r.score})
        </span>
      </div>
    `).join("");
}
function formatSummary(text) {
  if (!text) return "";

  return text
    // bold (**text**)
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")

    // bullet points (* text)
    .replace(/\*\s(.*?)(?=\n|$)/g, "<li>$1</li>")

    // line breaks
    .replace(/\n/g, "<br>")

    // wrap list items
    .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");
}
function cleanText(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
}