<template>
    <span style="z-index: 10">
        <div
            class="
                fixed top-0 left-0
                w-full h-full
                flex items-center justify-center
            "
            style="z-index: 50"
            v-show="menuIsActive"
        >
            <div 
                class="rounded-lg shadow-lg overflow-hidden w-action-fields max-w-full"
                style="z-index: 20"
            >
                <div style="background: #ffffff; padding: 28px 32px; max-height: calc(100vh - 160px); overflow-y: auto;">
                    <div
                        style="
                            font-weight: 700;
                            font-size: 1rem;
                            color: #1e293b;
                            margin-bottom: 16px;
                        "
                    >
                        Ajouter un bloc
                    </div>
                    <div
                        class="max-h-search overflow-auto"
                    >
                        <button
                            v-for="block in field.contentBlocks"
                            :key="block.key"
                            type="button"
                            style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                width: 100%;
                                text-align: left;
                                background: #ffffff;
                                border: 1px solid #e2e8f0;
                                border-radius: 8px;
                                padding: 12px 16px;
                                margin-bottom: 8px;
                                cursor: pointer;
                            "
                            :style="{ borderLeft: '4px solid ' + (block.accent || '#4f46e5') }"
                            @click="addBlock(block)"
                            @mouseover="hoveredKey = block.key"
                            @mouseleave="hoveredKey = null"
                            :class="{ 'bg-gray-50': hoveredKey === block.key }"
                        >
                            <span style="font-size: 1.6rem; line-height: 1;" v-text="block.icon || '🧩'"></span>
                            <span style="flex: 1; min-width: 0;">
                                <span
                                    style="
                                        display: block;
                                        font-weight: 700;
                                        font-size: 0.85rem;
                                        text-transform: uppercase;
                                        letter-spacing: 0.03em;
                                        color: #334155;
                                    "
                                    v-text="block.title"
                                ></span>
                                <span
                                    v-if="block.description"
                                    style="display: block; font-size: 0.85rem; color: #64748b; margin-top: 2px;"
                                    v-text="block.description"
                                ></span>
                            </span>
                        </button>
                    </div>
                </div>

                <div style="background: #f1f5f9; padding: 14px 24px;">   
                    <div class="flex items-center justify-end">
                        <button
                            type="button"
                            class="btn h-9 px-3 font-normal text-80"
                            @click="hideMenu"
                            v-text="__('cancel')"
                        >
                        </button>
                    </div>
                </div>
            </div>

            <div 
                class="
                    absolute top-0 left-0 w-full h-full
                    bg-80 opacity-75
                "
                style="z-index: 10"
                @click="hideMenu"
            >
            </div>
        </div>

        <span class="whitespace-nowrap">
            <base-button
                :isDisabled="mode != 'editor'"
                :clickMethod="showMenu"
                :icon="['fas', 'cubes']"
                :title="__('add content')"
            >
                
            </base-button>
        </span>
    </span>
</template>

<script>
import BaseButton from './BaseButton.vue';

export default {
    props: [
        'button', 
        'editor',
        'field',
        'mode',
        'imageDisk',
        'imagePath',
    ],

    data: function () {
        return {
            menuIsActive: false,
            blockKey: 'default',
            hoveredKey: null,
        }
    },

    components: {
        BaseButton,
    },

    methods: {
        addBlock(block) {
            let content = '';
            let key = String(_.random(0, 999))+String(Date.now());
            let tag = (block.tag || block.key)+'-content-block';
            let extraAttributes = '';
            _.each(block.attrs || {}, (value, name) => {
                extraAttributes += ' '+name+'="'+_.escape(value)+'"';
            });
            content += '<'+tag+' key="'+key+'"'+extraAttributes+' imageDisk="'+this.imageDisk+'" imagePath="'+this.imagePath+'"></'+tag+'>';


            this.editor
                .chain()
                .focus()
                .insertContent(content)
                .run();
            this.menuIsActive = false;
        },

        showMenu() {
            this.menuIsActive = true;
        },

        hideMenu() {
            this.menuIsActive = false;
        },
    }
}
</script>
