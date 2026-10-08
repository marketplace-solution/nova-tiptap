<template>
    <ContentBlockWrapper :label="config.label" :nodeKey="node.attrs.key">
        <div
            @click="showMenu"
            class="cursor-pointer"
            style="
                display: flex;
                align-items: center;
                gap: 12px;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px 16px;
            "
            :style="{ borderLeft: '4px solid ' + config.accent }"
        >
            <span style="font-size: 1.6rem; line-height: 1;" v-text="config.icon"></span>

            <div style="flex: 1; min-width: 0;">
                <div
                    style="
                        font-weight: 700;
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        letter-spacing: 0.03em;
                        color: #334155;
                    "
                    v-text="config.label"
                />
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
                        <span v-text="config.icon"></span>
                        <span v-text="' ' + config.label"></span>
                    </div>

                    <div class="flex flex-col">
                        <div
                            v-for="(field, index) in visibleFields"
                            :key="field.attr"
                            :style="{ marginTop: index > 0 ? '18px' : '0' }"
                        >
                            <label
                                style="
                                    display: block;
                                    font-weight: 600;
                                    font-size: 0.85rem;
                                    color: #334155;
                                    margin-bottom: 6px;
                                "
                                v-text="field.label"
                            ></label>

                            <div
                                v-if="field.input === 'select'"
                                style="display: flex; gap: 8px; flex-wrap: wrap;"
                            >
                                <button
                                    v-for="option in field.options"
                                    :key="option.value"
                                    type="button"
                                    style="
                                        flex: 1;
                                        min-width: 130px;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                        gap: 4px;
                                        padding: 12px 10px;
                                        border-radius: 8px;
                                        cursor: pointer;
                                        background: #ffffff;
                                        border: 2px solid #e2e8f0;
                                        color: #334155;
                                    "
                                    :style="values[field.attr] === option.value ? {
                                        borderColor: config.accent,
                                        background: '#f8fafc',
                                    } : {}"
                                    @click="values[field.attr] = option.value"
                                >
                                    <span
                                        v-if="option.icon"
                                        style="font-size: 1.5rem; line-height: 1;"
                                        v-text="option.icon"
                                    ></span>
                                    <span
                                        style="font-size: 0.85rem; font-weight: 700; text-align: center;"
                                        v-text="option.label"
                                    ></span>
                                    <span
                                        v-if="option.hint"
                                        style="font-size: 0.72rem; color: #64748b; text-align: center; line-height: 1.3;"
                                        v-text="option.hint"
                                    ></span>
                                </button>
                            </div>

                            <input
                                v-else
                                :type="field.input === 'number' ? 'number' : 'text'"
                                :min="field.min"
                                :max="field.max"
                                :placeholder="field.placeholder || ''"
                                style="
                                    width: 100%;
                                    border: 1px solid #cbd5e1;
                                    border-radius: 8px;
                                    padding: 9px 12px;
                                    font-size: 0.9rem;
                                    color: #1e293b;
                                    background: #ffffff;
                                "
                                v-model="values[field.attr]"
                            />
                        </div>
                    </div>
                </div>

                <div class="px-6 py-3" style="background: #f1f5f9;">
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
                                border-radius: 8px;
                                padding: 9px 18px;
                                margin-left: 10px;
                            "
                            :style="{ background: config.accent }"
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
import widgetTypes from './widgetTypes.js';
import { nodeViewProps } from '@tiptap/vue-3';

export default {
    props: nodeViewProps,

    components: {
        ContentBlockWrapper
    },

    data() {
        return {
            menuIsActive: false,
            values: {},
        }
    },

    computed: {
        config() {
            return widgetTypes[this.node.attrs.type] || {
                label: 'Widget',
                icon: '🧩',
                accent: '#94a3b8',
                summarize: () => '',
                fields: [],
            };
        },

        visibleFields() {
            return this.config.fields.filter((field) => this.matchesShowIf(field));
        },

        summary() {
            return this.config.summarize(this.node.attrs) || 'Cliquer pour configurer';
        }
    },

    methods: {
        matchesShowIf(field) {
            return this.fieldIsVisibleFor(field, this.values);
        },

        fieldIsVisibleFor(field, source) {
            if (!field.showIf) {
                return true;
            }

            return _.every(field.showIf, (expected, attr) => {
                const current = source[attr] || this.defaultFor(attr);
                return current === expected;
            });
        },

        defaultFor(attr) {
            const field = _.find(this.config.fields, { attr: attr });
            return field ? field.default : '';
        },

        showMenu() {
            const values = {};

            _.each(this.config.fields, (field) => {
                values[field.attr] = this.node.attrs[field.attr] || field.default;
            });

            this.values = values;
            this.menuIsActive = true;
        },

        update() {
            this.updateAttributes(Object.assign({}, this.values));

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
