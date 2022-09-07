const global = window as any;

const SpeechRecognition = global.SpeechRecognition || global.webkitSpeechRecognition;
const SpeechGrammarList = global.SpeechGrammarList || global.webkitSpeechGrammarList;
const SpeechRecognitionEvent = global.SpeechRecognitionEvent || global.webkitSpeechRecognitionEvent;

const colors = [
    "aqua",
    "azure",
    "beige",
    "bisque",
    "black",
    "blue",
    "brown",
    "chocolate",
    "coral",
    "crimson",
    "cyan",
    "fuchsia",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lime",
    "linen",
    "magenta",
    "maroon",
    "moccasin",
    "navy",
    "olive",
    "orange",
    "orchid",
    "peru",
    "pink",
    "plum",
    "purple",
    "red",
    "salmon",
    "sienna",
    "silver",
    "snow",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "white",
    "yellow",
];

const recognition = new SpeechRecognition();
if (SpeechGrammarList) {
    // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
    // This code is provided as a demonstration of possible capability. You may choose not to use it.
    const speechRecognitionList = new SpeechGrammarList();
    const grammar = "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
}
// recognition.continuous = false;
recognition.continuous = true;
// recognition.lang = "en-US";
recognition.lang = "zh-CN";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// recognition.onresult = function (event: any) {
//     // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
//     // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
//     // It has a getter so it can be accessed like an array
//     // The first [0] returns the SpeechRecognitionResult at the last position.
//     // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
//     // These also have getters so they can be accessed like arrays.
//     // The second [0] returns the SpeechRecognitionAlternative at position 0.
//     // We then return the transcript property of the SpeechRecognitionAlternative object
//     const result = event.results[0][0].transcript;
//     console.log("Confidence: " + event.results[0][0].confidence);
// };

// recognition.onspeechend = function () {
//     recognition.stop();
// };

// recognition.onnomatch = function (event: any) {
//     console.log("I didn't recognise that color.", event);
// };

recognition.onerror = function (event: any) {
    console.log("Error occurred in recognition: " + event.error);
};

export const startSpeech = () => {
    recognition.start();
};

export const stopSpeech = () => {
    recognition.stop();
};

export default recognition;
