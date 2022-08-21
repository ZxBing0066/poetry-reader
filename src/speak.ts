import pendingFactory from './pendingFactory';

const synth = window.speechSynthesis;

let chineseVoice: SpeechSynthesisVoice | null = null;

const updateVoice = () => {
    const voices = synth.getVoices();
    const _chineseVoice = voices.filter(v => v.lang === 'zh-CN')[0];
    chineseVoice = _chineseVoice;
};

updateVoice();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = updateVoice;
}

export const nullVoiceError = new Error('chineseVoice is null');

async function speak(content: string) {
    const [pending, ready, error] = pendingFactory();
    if (synth.speaking) {
        console.warn('speechSynthesis.speaking');
        return;
    }
    if (!chineseVoice) {
        console.error('chineseVoice is null');
        throw nullVoiceError;
    }

    const utterThis = new SpeechSynthesisUtterance(content);

    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
        ready();
    };

    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror', event);
        error(event);
    };

    utterThis.voice = chineseVoice;
    utterThis.rate = 0.8;
    synth.speak(utterThis);
    await pending;
}

export default speak;
