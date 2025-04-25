import React, { useState } from "react";
import "./LanguageTranslator.css";
import Layout from "./Layout";

// Web Speech API setup for voice input and output
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognition = new SpeechRecognition();

const LanguageTranslator = () => {
  const [text, setText] = useState(""); // Input text
  const [translatedText, setTranslatedText] = useState(""); // Translated text
  const [sourceLanguage, setSourceLanguage] = useState("en"); // Language of the input text
  const [targetLanguage, setTargetLanguage] = useState("es"); // Default language: Spanish for translation

  const languages = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    zh: "Chinese",
    hi: "Hindi",
    ar: "Arabic",
    bn: "Bengali",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    ko: "Korean",
    it: "Italian",
    tr: "Turkish",
    vi: "Vietnamese",
    id: "Indonesian",
    mr: "Marathi",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    gu: "Gujarati",
    kn: "Kannada",
    pa: "Punjabi",
    th: "Thai",
    pl: "Polish",
    uk: "Ukrainian",
    cs: "Czech",
    el: "Greek",
    sr: "Serbian",
    ro: "Romanian",
    sv: "Swedish",
    da: "Danish",
    no: "Norwegian",
    fi: "Finnish",
    he: "Hebrew",
    ms: "Malay",
    sw: "Swahili",
    ca: "Catalan",
    tl: "Filipino",
    hu: "Hungarian",
    sl: "Slovenian",
    am: "Amharic",
    ne: "Nepali",
    sq: "Albanian",
    et: "Estonian",
    lv: "Latvian",
    lt: "Lithuanian",
    mt: "Maltese",
    is: "Icelandic",
    gl: "Galician",
    bs: "Bosnian",
    mk: "Macedonian",
    ky: "Kazakh",
    uz: "Uzbek",
    km: "Khmer",
    my: "Burmese",
    lo: "Lao",
    si: "Sinhala",
    hy: "Armenian",
    az: "Azerbaijani",
  };

  const translateText = async () => {
    if (!text) return;

    const apiKey = "AIzaSyBQEMF38HAhmyARLq1PfxCDeropiYbefjU"; // Replace with your API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const requestBody = {
      q: text,
      target: targetLanguage,
      source: sourceLanguage,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.data && data.data.translations.length > 0) {
        setTranslatedText(data.data.translations[0].translatedText);
      }
    } catch (error) {
      console.error("Error translating text:", error);
      setTranslatedText("Translation failed. Please try again.");
    }
  };

  // Voice Input function using SpeechRecognition
  const startVoiceInput = () => {
    speechRecognition.start();
    speechRecognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setText(voiceText);
    };
  };

  // Voice Output function using SpeechSynthesis
  const speakTranslation = () => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLanguage; // Set the language for voice output
    speechSynthesis.speak(utterance);
  };

  return (
    <Layout>
      <div className="language-translator-container">
        <h2 className="lan">Language Translator</h2>

        {/* Language selection dropdowns */}
        <div className="dropdown-container">
          <div>
            <label>Type in: </label>
            <select
              onChange={(e) => setSourceLanguage(e.target.value)}
              value={sourceLanguage}
              className="language-dropdown"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Translate to: </label>
            <select
              onChange={(e) => setTargetLanguage(e.target.value)}
              value={targetLanguage}
              className="language-dropdown"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input and output text areas */}
        <div className="text-box-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="text-area"
          />

          <textarea
            value={translatedText}
            readOnly
            placeholder="Translated text..."
            className="text-area"
          />
        </div>

        {/* Translate button */}
        <button onClick={translateText} className="translate-button">
          Translate
        </button>

        {/* Voice input and output buttons */}
        <div className="voice-buttons">
          <button onClick={startVoiceInput} className="voice-button">
            🎤 Start Voice Input
          </button>
          <button onClick={speakTranslation} className="voice-button">
            🔊 Speak Translation
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LanguageTranslator;
