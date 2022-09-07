import pendingFactory from "./pendingFactory";

const synth = window.speechSynthesis;

let chineseVoice: SpeechSynthesisVoice | null = null;

const updateVoice = () => {
    const voices = synth.getVoices();
    const _chineseVoice = voices.filter((v) => v.lang === "zh-CN")[0];
    chineseVoice = _chineseVoice;
};

updateVoice();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = updateVoice;
}

export const nullVoiceError = new Error("chineseVoice is null");

async function speak(content: string) {
    console.log(`speak: ${content}`);

    const [pending, ready, error] = pendingFactory();
    if (synth.speaking) {
        console.warn("speechSynthesis.speaking");
        return;
    }
    if (!chineseVoice) {
        console.error("chineseVoice is null");
        throw nullVoiceError;
    }

    const utterThis = new SpeechSynthesisUtterance(content);

    // (["onstart", "onboundary", "onpause", "onmark", "onresume"] as (keyof typeof utterThis)[]).forEach((eventName) => {
    //     utterThis[eventName] = ((e: any) => {
    //         console.log(eventName, e);
    //     }) as unknown as never;
    // });

    utterThis.onend = function (event) {
        console.log("speak end");
        ready();
    };

    utterThis.onerror = function (event) {
        console.error("SpeechSynthesisUtterance.onerror", event);
        error(event);
    };

    utterThis.voice = chineseVoice;
    utterThis.rate = 0.8;
    synth.speak(utterThis);
    await pending;
}

export default speak;
