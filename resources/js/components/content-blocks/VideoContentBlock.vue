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
                class="rounded-lg shadow-lg overflow-hidden w-action-fields max-w-full"
                style="z-index: 20"
            >
                <div class="px-8 py-8 bg-white" style="background: #ffffff;">
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
                                class="text-sm mb-1 ml-1"
                                style="display: block; margin-bottom: 4px;"
                                v-text="trans('embed code')"
                            ></label>
                            <textarea
                                class="
                                    form-input
                                    form-input-bordered
                                    h-32
                                    px-2 py-1 w-full
                                    text-sm text-90
                                    leading-none
                                "
                                v-model="embedCode"
                            />
                        </div>

                        <div class="mt-3">
                            <label
                                class="text-sm mb-1 ml-1"
                                style="display: block; margin-bottom: 4px;"
                                v-text="trans('caption')"
                            ></label>
                            <textarea
                                class="
                                    form-input
                                    form-input-bordered
                                    h-16
                                    px-2 py-1 w-full
                                    text-sm text-90
                                    leading-none
                                "
                                v-model="caption"
                            />
                        </div>

                        <div class="mt-3">
                            <label
                                class="text-sm mb-1 ml-1"
                                style="display: block; margin-bottom: 4px;"
                                v-text="trans('credits')"
                            ></label>
                            <input
                                type="text"
                                class="
                                    form-input
                                    form-input-bordered
                                    px-2 py-1 w-full
                                    text-sm text-90
                                    leading-none
                                "
                                v-model="credits"
                            />
                        </div>

                        <div class="mt-3">
                            <label
                                class="text-sm mb-1 ml-1"
                                style="display: block; margin-bottom: 4px;"
                                v-text="trans('ratio')"
                            ></label>
                            <select
                                class="
                                    form-input
                                    form-input-bordered
                                    px-2 py-1 w-full
                                    text-sm text-90
                                    leading-none
                                "
                                v-model="ratio"
                            >
                                <option
                                    v-for="ratioOption in ratioOptions"
                                    :key="ratioOption"
                                    :value="ratioOption"
                                    v-text="ratioOption"
                                />
                            </select>
                        </div>
                    </div>
                </div>

                <div class="bg-30 px-6 py-3" style="background: #f1f5f9;">
                    <div class="flex items-center justify-end">
                        <button
                            type="button"
                            class="btn h-9 px-3 font-normal text-80"
                            @click="hideMenu"
                            v-text="trans('cancel')"
                        >
                        </button>

                        <button
                            type="button"
                            class="ml-3 btn btn-default btn-primary"
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
