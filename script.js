const mic = document.getElementById("mic");
const statusEl = document.getElementById("status");
const heardEl = document.getElementById("heard");
const replyEl = document.getElementById("reply");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();
}

loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

function pickVoice() {
  const preferred = ["Google UK English Female", "Google US English", "Microsoft Zira", "Microsoft Heera", "Samantha"];
  for (const name of preferred) {
    const found = voices.find(function (v) {
      return v.name.includes(name);
    });
    if (found) return found;
  }
  return voices.find(function (v) {
    return v.lang === "en-IN";
  }) || voices[0];
}

function speak(text) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice ? voice.lang : "en-IN";
  utterance.rate = 1;
  utterance.pitch = 1.1;
  speechSynthesis.speak(utterance);
}

function getReply(text) {
  if (text.includes("hello") || text.includes("hi ") || text === "hi") {
    return "Hello! How can I help you?";
  }
  if (text.includes("your name")) {
    return "I am basant871, your personal assistant.";
  }
  if (text.includes("how are you")) {
    return "I am doing great. Thank you for asking.";
  }
  if (text.includes("time")) {
    return "The time is " + new Date().toLocaleTimeString();
  }
  if (text.includes("date") || text.includes("what day")) {
    return "Today is " + new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }
  if (text.includes("open youtube")) {
    window.open("https://www.youtube.com", "_blank");
    return "Opening YouTube";
  }
  if (text.includes("open google")) {
    window.open("https://www.google.com", "_blank");
    return "Opening Google";
  }
  if (text.includes("open instagram")) {
    window.open("https://www.instagram.com", "_blank");
    return "Opening Instagram";
  }
  if (text.startsWith("search for ") || text.startsWith("search ")) {
    const query = text.replace("search for ", "").replace("search ", "");
    window.open("https://www.google.com/search?q=" + encodeURIComponent(query), "_blank");
    return "Searching for " + query;
  }
  if (text.startsWith("play ")) {
    const song = text.replace("play ", "");
    window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(song), "_blank");
    return "Playing " + song + " on YouTube";
  }
  if (text.includes("joke")) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "I told my computer I needed a break, and it went to sleep.",
      "Why was the JavaScript developer sad? Because he did not know how to null his feelings."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  if (text.includes("calculate") || text.includes("plus") || text.includes("minus") || text.includes("times") || text.includes("divided")) {
    const expr = text
      .replace("calculate", "")
      .replace(/plus/g, "+")
      .replace(/minus/g, "-")
      .replace(/times|multiplied by/g, "*")
      .replace(/divided by/g, "/")
      .replace(/[^0-9+\-*/. ]/g, "");
    try {
      const result = Function("return " + expr)();
      return "The answer is " + result;
    } catch (e) {
      return "Sorry, I could not calculate that.";
    }
  }
  return "Sorry, I did not understand that. Please try again.";
}

if (!SpeechRecognition) {
  statusEl.textContent = "Speech recognition is not supported. Use Chrome.";
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;

  mic.addEventListener("click", function () {
    recognition.start();
    mic.classList.add("listening");
    statusEl.textContent = "Listening...";
  });

  recognition.addEventListener("result", function (event) {
    const text = event.results[0][0].transcript.toLowerCase();
    heardEl.textContent = "You: " + text;
    const answer = getReply(text);
    replyEl.textContent = "basant871: " + answer;
    speak(answer);
  });

  recognition.addEventListener("end", function () {
    mic.classList.remove("listening");
    statusEl.textContent = "Tap the mic and speak";
  });

  recognition.addEventListener("error", function (event) {
    statusEl.textContent = "Error: " + event.error;
  });
}