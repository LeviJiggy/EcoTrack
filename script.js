const questions = [
    {
      label: "Wie viele Kilometer fährst du pro Woche mit dem Auto?",
      name: "auto_km",
      options: [[0, "0 km"], [2, "1–50 km"], [5, "51–150 km"], [8, "151–300 km"], [12, "mehr als 300 km"]]
    },
    {
      label: "Wie viele Flüge machst du pro Jahr?",
      name: "flug",
      options: [[0, "Nie"], [5, "1–2x"], [10, "3–5x"], [15, ">5x"]]
    },
    {
      label: "Wie häufig isst du Fleisch?",
      name: "fleisch",
      options: [[0, "Nie"], [2, "1–2x/Woche"], [4, "3–5x/Woche"], [6, "Täglich"]]
    },
    {
      label: "Wie oft nutzt du öffentliche Verkehrsmittel?",
      name: "oev",
      options: [[0, "Täglich"], [1, "Oft"], [3, "Selten"], [5, "Nie"]]
    },
    {
      label: "Welches Heizsystem nutzt du?",
      name: "heizung",
      options: [[2, "Wärmepumpe"], [4, "Gas"], [6, "Öl"]]
    },
    {
      label: "Wie viele Kleidungsstücke kaufst du im Monat?",
      name: "kleidung",
      options: [[0, "0"], [2, "1–2"], [4, "3–5"], [6, "Mehr als 5"]]
    },
    {
      label: "Wie oft isst du verpacktes Essen?",
      name: "verpackung",
      options: [[0, "Nie"], [2, "Selten"], [4, "Oft"], [6, "Täglich"]]
    }
  ];
  
  const tipSuggestions = {
    auto_km: ["🚶 Weniger Autofahren – nutze öfter das Rad oder laufe kurze Strecken.", "🚗 Carsharing kann eine umweltfreundlichere Option sein."],
    flug: ["✈️ Fliege weniger – nutze Zug oder Videokonferenzen.", "🌍 Kompensiere Flüge durch CO₂-Ausgleichsprojekte."],
    fleisch: ["🥗 Reduziere deinen Fleischkonsum.", "🌱 Probiere 1–2 vegetarische Tage pro Woche."],
    oev: ["🚌 Nutze öffentliche Verkehrsmittel häufiger.", "🚆 Ein Monatsticket lohnt sich oft."],
    heizung: ["🔥 Prüfe die Effizienz deiner Heizung.", "🌡️ Senke die Raumtemperatur leicht ab."],
    kleidung: ["👕 Weniger Kleidung kaufen – Second Hand ist nachhaltiger.", "👚 Setze auf langlebige Kleidung."],
    verpackung: ["📦 Kaufe unverpackte Lebensmittel.", "♻️ Nutze wiederverwendbare Behälter."]
  };
  
  const challenges = [
    "🌱 Verzichte diese Woche auf Fleisch!",
    "🚲 Nutze jeden Tag das Fahrrad oder gehe zu Fuß!",
    "📦 Bestelle diese Woche nichts online!",
    "🧥 Kaufe diese Woche keine neue Kleidung!"
  ];
  
  function getWeeklyChallenge() {
    const weekIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7)) % challenges.length;
    return challenges[weekIndex];
  }
  
  document.getElementById("headerChallenge").textContent = getWeeklyChallenge();
  
  let current = 0;
  let formData = [];
  
  function startQuiz() {
    document.getElementById("intro").classList.remove("active");
    document.getElementById("quizSection").classList.add("active");
    renderQuestion();
  }
  
  function renderQuestion() {
    const container = document.getElementById("quizSection");
    container.innerHTML = "";
   
    if (current >= questions.length) return calculateResult();
   
    const q = questions[current];
    const label = document.createElement("h2");
    label.textContent = `${current + 1}. ${q.label}`;
    container.appendChild(label);
   
    const select = document.createElement("select");
    select.name = q.name;
   
    for (const [value, text] of q.options) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      select.appendChild(option);
    }
   
    // Wenn vorher schon eine Antwort existiert, setze sie als ausgewählt
    if (formData[current] !== undefined) {
      select.value = formData[current];
    }
   
    container.appendChild(select);
   
    // Weiter-Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Weiter";
    nextButton.onclick = () => {
      formData[current] = parseFloat(select.value);
      current++;
      showLoader(renderQuestion);
    };
    container.appendChild(nextButton);
   
    // Zurück-Button nur anzeigen, wenn nicht auf erster Frage
    if (current > 0) {
      const backButton = document.createElement("button");
      backButton.textContent = "Zurück";
      backButton.style.marginLeft = "10px";
      backButton.onclick = () => {
        current--;
        showLoader(renderQuestion);
      };
      container.appendChild(backButton);
    }
  }
  
  function showLoader(callback) {
    const container = document.getElementById("quizSection");
    container.innerHTML = '<div class="loader"></div>';
    setTimeout(callback, 400);
  }
  
  function calculateResult() {
    const score = formData.reduce((a, b) => a + b, 0);
    const emission = (score * 0.45).toFixed(2); // überarbeitet
 
    // Speichern in localStorage
    localStorage.setItem("lastCo2Score", emission);
  
    document.getElementById("quizSection").classList.remove("active");
    document.getElementById("resultSection").classList.add("active");
  
    document.getElementById("co2Output").innerHTML = `<p><strong>Dein geschätzter CO₂-Ausstoß: ${emission} Tonnen/Jahr</strong></p>`;
  
    const ctx = document.getElementById("co2Chart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Du", "Österreich", "Deutschland", "USA", "China", "Weltweit"],
        datasets: [{
          label: "CO₂ (Tonnen/Jahr)",
          data: [emission, 6.65, 9.1, 14.2, 7.6, 4.8],
          backgroundColor: ["#4caf50", "#8e24aa", "#1e88e5", "#fb8c00", "#43a047", "#6d4c41"],
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Tonnen CO₂" }
          }
        }
      }
    });
  
    document.getElementById("challengeHighlight").textContent = getWeeklyChallenge();
  
    const tipBox = document.getElementById("tipBox");
    tipBox.innerHTML = "";
    const selectedTips = [];
  
    questions.forEach((q, i) => {
      const value = formData[i];
      const tips = tipSuggestions[q.name];
      if (value > 2 && tips) {
        selectedTips.push(...tips);
      }
    });
  
    const uniqueTips = [...new Set(selectedTips)].slice(0, 3);
    if (uniqueTips.length) {
      uniqueTips.forEach(tip => {
        const div = document.createElement("div");
        div.className = "tip-box";
        div.textContent = tip;
        tipBox.appendChild(div);
      });
    } else {
      tipBox.innerHTML = '<div class="tip-box">🎉 Du machst schon vieles richtig! Weiter so!</div>';
    }
  }

  function resetQuiz() {
    localStorage.removeItem("lastCo2Score");
    location.reload();
  }

  window.addEventListener("DOMContentLoaded", () => {
    const savedScore = localStorage.getItem("lastCo2Score");
    if (savedScore) {
      const introSection = document.getElementById("intro");
      const resultBox = document.createElement("div");
      resultBox.className = "result-preview";
      resultBox.innerHTML = `
  <h3>🌍 Dein letzter CO₂-Wert</h3>
  <p><strong>${savedScore} Tonnen CO₂ / Jahr</strong></p>
  <p>Du kannst den Test jederzeit erneut durchführen.</p>
      `;
      introSection.insertBefore(resultBox, introSection.querySelector("button"));
    }
  });

  // Theme laden aus Cookie
function loadThemeFromCookie() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('theme='));
  if (cookieValue && cookieValue.split('=')[1] === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('themeToggle').textContent = '☀️ Light Mode';
  }
}

// Theme speichern in Cookie
function saveThemeToCookie(theme) {
  document.cookie = `theme=${theme};path=/;max-age=31536000`; // 1 Jahr
}

// Toggle-Button initialisieren
window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');

  toggle.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    toggle.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
    saveThemeToCookie(dark ? 'dark' : 'light');
  });

  loadThemeFromCookie(); // Beim Laden prüfen
});
