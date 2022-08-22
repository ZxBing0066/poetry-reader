<script setup lang="ts">
import { load, Res } from "jinrishici";
import { nextTick, ref } from "vue";

import speak, { nullVoiceError } from "./speak";

const poetry = ref<Res | null>(null);
const reading = ref(false);

load((result) => {
    poetry.value = result;
});

const read = async () => {
    if (reading.value) return;
    reading.value = true;
    if (poetry.value) {
        try {
            initialStyle();
            doAnimate("title");
            await speak(poetry.value.data.origin.title);
            doAnimate("author");
            await speak(poetry.value.data.origin.dynasty);
            await speak(poetry.value.data.origin.author);
            let i = 0;
            for await (const content of poetry.value.data.origin.content) {
                doAnimate("content", i++);
                await speak(content);
            }
        } catch (e) {
            if (e === nullVoiceError) {
                alert("未找到可用的语音，换新版 chrome 试试吧");
            }
        } finally {
            reading.value = false;
        }
    }
};

const keyframes = [{ opacity: 0.2 }, { opacity: 1 }];
const animateOptions: KeyframeAnimationOptions = {
    duration: 1500,
};

const selector = {
    title: ".poetry h1",
    author: ".poetry .author",
    content: ".poetry article section",
};

const initialStyle = () => {
    for (const key in selector) {
        const els = document.querySelectorAll(selector[key as keyof typeof selector]);

        els.forEach((el) => {
            (el as HTMLElement).style.opacity = "0";
        });
    }
};

const doAnimate = async (target: keyof typeof selector, index: number = 0) => {
    const dom = document.querySelectorAll(selector[target]);
    const animate = dom[index]?.animate(keyframes, animateOptions);
    await animate.finished;
    (dom[index] as HTMLElement).style.opacity = "1";
};

const more = async () => {
    if (reading.value) return;
    window.speechSynthesis.cancel();
    load((result) => {
        console.log(result);
        poetry.value = result;
        nextTick(() => {
            read();
        });
    });
};
</script>

<template>
    <main>
        <div class="poetry" v-if="poetry" @click="read">
            <h1>
                {{ poetry.data.origin.title }}
            </h1>
            <p class="author">
                {{ poetry.data.origin.dynasty }}
                {{ poetry.data.origin.author }}
            </p>
            <article>
                <section v-for="_content in poetry.data.origin.content">{{ _content }}</section>
            </article>
        </div>
    </main>
    <div class="btn-group" v-if="!reading">
        <button @click="read">开始朗诵</button>
        <button @click="more">再来一首</button>
    </div>
</template>

<style scoped lang="scss">
@font-face {
    font-family: "cfkai";
    src: url("cfkai.ttf") format("truetype");
}
.poetry {
    font-family: "Weibei SC", STXingkai, "KaiTi SC", STKaiTi, "黑体", "宋体", "Xingkai SC";
    padding: 1.5rem;
    margin-bottom: 2rem;

    p.author {
        font-size: 1.4rem;
        color: #333;
    }
    article {
        font-size: 1.6rem;
    }
    section {
        margin-bottom: 0.5em;
    }

    h1 {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 0.75em;
    }
}
.btn-group {
    button + button {
        margin-left: 1em;
    }
}
</style>
