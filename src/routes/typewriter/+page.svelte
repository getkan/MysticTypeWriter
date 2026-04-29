<script lang="ts">;
    import { state as configState } from '../config.svelte';
    import { onMount } from 'svelte';
    import { STORAGE_KEY, TypewriterConfigInput, type TypewriterConfig, DISAPPEARANCE_CONFIG } from '$lib/TypewriterConfig';
    import {playTypewriterSound} from './audio.svelte';
    import { goto } from '$app/navigation';
    import SoundOn from './SoundOn.svelte';
    import SoundOff from './SoundOff.svelte';
    import Typewriter from '$lib/Typewriter.svelte';

    type ParsedChunk = {
        text: string;
        opacity: number,
    };

    let typewriterConfig = $state<TypewriterConfig | null>(null);
    let typewriterInput = $state("");
    let soundToggle = $state(true);

    const onSoundToggle = () => {
        soundToggle = !soundToggle;
        focusTypewriter();
    }

    let inputRef: HTMLSpanElement | null = null;
    let lineRef: HTMLDivElement | null = null

    onMount(() => {
        try {
            const loadConfig = (config: Partial<TypewriterConfig> | null) => {
                if (!config) return false;
                const configInput = new TypewriterConfigInput(config);
                if (configInput.validate()) {
                    typewriterConfig = configInput.toTypewriterConfig();
                    return true;
                }
                return false;
            };

            if (loadConfig(configState.config)) return;

            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && loadConfig(JSON.parse(stored))) return;

            goto('/');
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            goto('/');
        } finally {
            inputRef?.focus();
        }
    });

    const onkeydownTypewriter = (e: KeyboardEvent) => {
        if(e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault();
        }
        focusTypewriter();
    };

    const onkeyupTypewriter = () => {
        if(soundToggle) {
            playTypewriterSound();
        }
    };

    const inputTypewriter = (e: Event & { currentTarget: EventTarget & HTMLSpanElement })=> {
        const target = e.currentTarget;
        console.log(target.innerText)
        typewriterInput = target.innerText;
        if(lineRef){
            lineRef.innerHTML = typewriterInput.replace(/\S+\s*/g, '<n>$&</n>');
        }
    };

    const focusTypewriter = () => {
        inputRef?.focus();
        const sel = window.getSelection();
        if (inputRef && sel) {
            const range = document.createRange();
            range.selectNodeContents(inputRef);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const parseInput = (input: string): ParsedChunk[] => {
        if (!typewriterConfig) {
            return [{ text: input, opacity: 100 }];
        }

        const { disappearanceMode } = typewriterConfig;
        const regexes: Record<string, RegExp> = {
            sentence: /[^.!?]*[.!?]*/g,
            word: /\S+\s*/g,
        };
        const {show, fade} = DISAPPEARANCE_CONFIG[disappearanceMode];
        let matchArray = [];
        if(disappearanceMode === 'line'){
            if(!lineRef){
                return [{ text: input, opacity: 100 }];
            }

            let spans = lineRef.children;
            let top = 0;
            let lineArr = [''];

            // 1. Split text into individual spans for each word
            lineRef.innerHTML = lineRef.textContent.replace(/\S+\s*/g, '<n>$&</n>');
        
            // 2. Loop through words and check if 'top' changes
            for (let i = 0; i < spans.length; i++) {
                var rect = spans[i].getBoundingClientRect();
                if (rect.top > top) {
                    if(top > 0 ){
                        lineArr.push('')
                    }
                    top = rect.top;
                }
                lineArr[lineArr.length - 1] += spans[i].textContent
            }
            matchArray = lineArr;
        } else {
            const regex = regexes[disappearanceMode] || regexes['word'];
            matchArray = (input.match(regex)?.filter(Boolean) || []);
        }

        const matchArrayLn = matchArray.length;
        const hideUntil = matchArrayLn - (show + fade);
        const fadeUntil = matchArrayLn - show;
        let fadeCount = 0;

        return matchArray.map((item, index) => {
            if (hideUntil && index < hideUntil) {
                return { text: item, opacity: 0 };
            }

            if (fadeUntil && index < fadeUntil) {
                if (fade > 1) {
                    fadeCount += 1;
                    const opacity = Math.max(0, Math.min(100, Math.round((100 / fade) * fadeCount)));
                    return { text: item, opacity };
                }
                return { text: item, opacity: 50 };
            }

            return { text: item, opacity: 100 };
        });
    };

    const parsedChunks = $derived.by(() => parseInput(typewriterInput));

    const safeInput = $derived.by(() => {
        return typewriterInput
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    });
</script>

<div 
    class="relative border-2 border-offwhite rounded-lg p-4 sm:p-8 w-[90vw] h-[75vh] max-h-150 max-w-250 flex flex-col justify-end" 
    onclick={() => inputRef?.focus()}
    onkeydown={() => {}}
    role="button"
    tabindex="0"
    aria-label="Typewriter input area, click to focus"
>

    <h1 class="absolute font-bold bg-background text-[2rem] px-2 -top-6 right-8">
        <Typewriter />
    </h1>

    <a href="/" class="absolute w-fit rounded-lg p-2 flex gap-2 items-baseline -top-12 left-0"><span class="text-[2rem] leading-4">←</span>Back</a>

    <div class="relative w-full max-w-full overflow-hidden">
        <span
            contenteditable="true"
            role="textbox"
            tabindex="0"
            class="block w-full outline-none text-left whitespace-pre-wrap wrap-break-word text-transparent"
            spellcheck="false"
            bind:this={inputRef}
            onkeydown={onkeydownTypewriter}
            onkeyup={onkeyupTypewriter}
            oninput={inputTypewriter}
            onpaste={(e) => e.preventDefault()}
        ></span>

        <div class="pointer-events-none absolute inset-0 block w-full text-left whitespace-pre-wrap wrap-break-word after:content-[''] after:inline-block after:w-1 after:h-[1.1em] after:bg-current after:ml-px after:align-middle">
            {#each parsedChunks as chunk}
                {@render Chunk(chunk.text, chunk.opacity)}
            {/each}
        </div>
        <div bind:this={lineRef} class="pointer-events-none absolute inset-0 invisible w-full text-left whitespace-pre-wrap wrap-break-word"></div>
    </div>

    <button onclick={onSoundToggle} class="absolute -bottom-12">
        {#if soundToggle}
            <SoundOn class="h-8 w-8"/>
        {:else}
            <SoundOff class="h-8 w-8"/>
        {/if}
    </button>

</div>

{#snippet Chunk(text: string, opacity: number)}
    <span style="opacity:{opacity}%">{text}</span>
{/snippet}