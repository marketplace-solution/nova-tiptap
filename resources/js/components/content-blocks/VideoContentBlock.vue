<template>
    <ContentBlockWrapper label="Video" :nodeKey="node.attrs.key">
        <div
            @click="showMenu"
            class="cursor-pointer"
            style="
                display: flex;
                align-items: center;
                gap: 12px;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-left: 4px solid #8b5cf6;
                border-radius: 8px;
                padding: 12px 16px;
            "
        >
            <span style="font-size: 1.6rem; line-height: 1;">🎬</span>

            <div style="flex: 1; min-width: 0;">
                <div
                    style="
                        font-weight: 700;
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        letter-spacing: 0.03em;
                        color: #334155;
                    "
                >
                    Iframe / Widget externe
                </div>
                <div
                    style="font-size: 0.85rem; color: #64748b; margin-top: 2px;"
                    v-text="summary"
                />
            </div>

            <button
                type="button"
                style="
                    flex-shrink: 0;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #334155;
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    padding: 5px 12px;
                    cursor: pointer;
                "
                @click.stop="showMenu"
            >
                ✏️ Éditer
            </button>
        </div>

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
                class="rounded-lg shadow-lg overflow-hidden max-w-full"
                style="z-index: 20; width: min(840px, calc(100vw - 48px));"
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
                        🎬 Iframe / Widget externe
                    </div>

                    <div class="flex flex-col">
                        <div>
                            <label
                                style="
                                    display: block;
                                    font-weight: 600;
                                    font-size: 0.85rem;
                                    color: #334155;
                                    margin-bottom: 6px;
                                "
                                v-text="trans('embed code')"
                            ></label>
                            <textarea
                                style="
                                    width: 100%;
                                    border: 1px solid #334155;
                                    border-radius: 8px;
                                    padding: 12px 14px;
                                    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
                                    font-size: 0.82rem;
                                    line-height: 1.5;
                                    color: #e2e8f0;
                                    background: #0f172a;
                                    min-height: 130px;
                                "
                                rows="6"
                                spellcheck="false"
                                placeholder='&lt;iframe src="https://..."&gt;&lt;/iframe&gt;'
                                v-model="embedCode"
                            />
                        </div>

                        <div class="mt-3">
                            <label
                                style="
                                    display: block;
                                    font-weight: 600;
                                    font-size: 0.85rem;
                                    color: #334155;
                                    margin-bottom: 6px;
                                "
                                v-text="trans('caption')"
                            ></label>
                            <textarea
                                style="
                                    width: 100%;
                                    border: 1px solid #cbd5e1;
                                    border-radius: 8px;
                                    padding: 9px 12px;
                                    font-size: 0.9rem;
                                    color: #1e293b;
                                    background: #ffffff;
                                "
                                rows="2"
                                v-model="caption"
                            />
                        </div>

                        <div class="mt-3">
                            <label
                                style="
                                    display: block;
                                    font-weight: 600;
                                    font-size: 0.85rem;
                                    color: #334155;
                                    margin-bottom: 6px;
                                "
                                v-text="trans('credits')"
                            ></label>
                            <input
                                type="text"
                                style="
                                    width: 100%;
                                    border: 1px solid #cbd5e1;
                                    border-radius: 8px;
                                    padding: 9px 12px;
                                    font-size: 0.9rem;
                                    color: #1e293b;
                                    background: #ffffff;
                                "
                                v-model="credits"
                            />
                        </div>

                        <div class="mt-3">
                            <label
                                style="
                                    display: block;
                                    font-weight: 600;
                                    font-size: 0.85rem;
                                    color: #334155;
                                    margin-bottom: 6px;
                                "
                                v-text="trans('ratio')"
                            ></label>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                <button
                                    v-for="ratioOption in ratioOptions"
                                    :key="ratioOption"
                                    type="button"
                                    style="
                                        padding: 7px 14px;
                                        border-radius: 999px;
                                        cursor: pointer;
                                        background: #ffffff;
                                        border: 2px solid #e2e8f0;
                                        font-size: 0.85rem;
                                        font-weight: 600;
                                        color: #334155;
                                    "
                                    :style="ratio === ratioOption ? { borderColor: '#8b5cf6', background: '#f8fafc' } : {}"
                                    @click="ratio = ratioOption"
                                    v-text="ratioOption"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: #f1f5f9; padding: 14px 24px;">
                    <div class="flex items-center justify-end">
                        <button
                            type="button"
                            style="
                                background: none;
                                border: none;
                                cursor: pointer;
                                font-size: 0.9rem;
                                font-weight: 600;
                                color: #64748b;
                                padding: 8px 14px;
                            "
                            @click="hideMenu"
                            v-text="trans('cancel')"
                        >
                        </button>

                        <button
                            type="button"
                            style="
                                border: none;
                                cursor: pointer;
                                font-size: 0.9rem;
                                font-weight: 700;
                                color: #ffffff;
                                background: #8b5cf6;
                                border-radius: 8px;
                                padding: 9px 18px;
                                margin-left: 10px;
                            "
                            @click="update()"
                            v-text="trans('update')"
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
                style="z-index: 10; background: #000000; opacity: 0.5;"
                @click="hideMenu"
            >
            </div>
        </div>
    </ContentBlockWrapper>
</template>

<script>

import ContentBlockWrapper from './ContentBlockWrapper';
import { nodeViewProps } from '@tiptap/vue-3';

export default {
    props: nodeViewProps,

    components: {
        ContentBlockWrapper
    },

    data() {
        return {
            menuIsActive: false,
            embedCode: '',
            caption: '',
            credits: '',
            ratio: '',
            ratioOptions: [
                '16:9',
                '4:3',
                '1:1',
                '9:16',
                '3:4',
                '2:1',
                '8:5',
            ]
        }
    },

    computed: {
        title() {
            let code = this.node.attrs.embedCode;

            if (!code || !code.substr('src=')) {
                return this.trans('no embed code');
            }

            let url = code.substr((code.indexOf('src=') + 5));

            url = url.substr(0, url.indexOf('"'));

            let id = url.substr((url.lastIndexOf('/') + 1));

            if (id.indexOf('?') > -1) {
                id = id.substr(0, id.indexOf('?'));
            }

            const knownPlatforms = ['vimeo', 'youtube'];

            let title = '';
            _.each(knownPlatforms, function(knownPlatform){
                if (url.toLowerCase().indexOf(knownPlatform) > -1) {
                    title = _.upperFirst(knownPlatform)+' Video ('+id+')';
                }
            })

            if (!title) {
                title = url;

                if (title.lastIndexOf('?') > -1) {
                    title = title.substr(0, title.lastIndexOf('?'));
                }

                if (title.indexOf('//') > -1) {
                    title = title.substr(title.indexOf('//') + 2);
                }
            }

            return title;
        },

        summary() {
            const parts = [this.title];

            if (this.node.attrs.ratio) {
                parts.push(this.node.attrs.ratio);
            }

            if (this.node.attrs.caption) {
                parts.push(this.node.attrs.caption);
            }

            return parts.join(' · ');
        }
    },

    methods: {
        showMenu() {
            this.embedCode = this.node.attrs.embedCode ? this.node.attrs.embedCode : '';
            this.caption = this.node.attrs.caption ? this.node.attrs.caption : '';
            this.credits = this.node.attrs.credits ? this.node.attrs.credits : '';
            this.ratio = this.node.attrs.ratio ? this.node.attrs.ratio : '16:9';

            this.menuIsActive = true;
        },

        update() {
            this.updateAttributes({
                embedCode: this.embedCode,
                caption: this.caption,
                credits: this.credits,
                ratio: this.ratio,
            });

            this.hideMenu();
        },

        hideMenu() {
            this.menuIsActive = false;
        },

        deleteBlock() {
            this.$el.remove();
        },

        trans(str) {
            return Nova.config('tiptapTranslations')[str] || str;
        }
    }
}
</script>
