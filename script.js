const mic = document.getElementById("mic");
const statusEl = document.getElementById("status");
const heardEl = document.getElementById("heard");
const replyEl = document.getElementById("reply");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  speechSynthesis.speak(utterance);
}

function getReply(text) {
  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! How can I help you?";
  }
  if (text.includes("your name")) {
    return "I am basant871, your personal assistant.";
  }
  if (text.includes("time")) {
    return "The time is " + new Date().toLocaleTimeString();
  }
  if (text.includes("date") || text.includes("day")) {
    return "Today is " + new Date().toLocaleDateString();
  }
  if (text.includes("open youtube")) {
    window.open("https://www.youtube.com", "_blank");
    return "Opening YouTube";
  }
  if (text.includes("open google")) {
    window.open("https://www.google.com", "_blank");
    return "Opening Google";
  }
  if (text.includes("joke")) {
    return "Why do programmers prefer dark mode? Because light attracts bugs.";
  }
  return "Sorry, I did not understand that. Please try again.";
}