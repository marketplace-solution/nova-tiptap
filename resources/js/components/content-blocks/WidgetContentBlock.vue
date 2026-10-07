<template>
    <ContentBlockWrapper :label="config.label" :nodeKey="node.attrs.key">
        <div
            @click="showMenu"
            class="cursor-pointer"
        >
            <div
                class="font-bold"
                v-text="summary"
            />
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
                <div class="px-8 py-8 bg-white">
                    <div class="flex flex-col">
                        <div
                            v-for="(field, index) in visibleFields"
                            :key="field.attr"
                            :class="{ 'mt-3': index > 0 }"
                        >
                            <label class="text-sm mb-1 ml-1" v-text="field.label"></label>

                            <select
                                v-if="field.input === 'select'"
                                class="
                                    form-input
                                    form-input-bordered
                                    px-2 py-1 w-full
                                    text-sm text-90
                                    leading-none
                                "
                                v-model="values[field.attr]"
                            >
                                <option
                                    v-for="option in field.options"
                                    :key="option.value"
                                    :value="option.value"
                                    v-text="option.label"
                                />
                            </select>

                            <input
                                v-else
                                :type="field.input === 'number' ? 'number' : 'text'"
                                class="
                                    form-input
                                    form-input-bordered
                                    px-2 py-1 w-full
                                    text-sm text-90
                                    leading-none
                                "
                                v-model="values[field.attr]"
                            />
                        </div>
                    </div>
                </div>

                <div class="bg-30 px-6 py-3">
                    <div class="flex items-center justify-end">
                        <button
                            type="button"
                            class="btn h-9 px-3 font-normal text-80"
                            @click="hideMenu"
                            v-text="__('cancel')"
                        >
                        </button>

                        <button
                            type="button"
                            class="ml-3 btn btn-default btn-primary"
                            @click="update()"
                            v-text="__('update')"
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
            return widgetTypes[this.node.attrs.type] || { label: 'Widget', fields: [] };
        },

        visibleFields() {
            return this.config.fields.filter((field) => this.matchesShowIf(field));
        },

        summary() {
            const parts = [];

            _.each(this.config.fields, (field) => {
                if (!this.fieldIsVisibleFor(field, this.node.attrs)) {
                    return;
                }

                const value = this.node.attrs[field.attr];

                if (field.input === 'select') {
                    const option = _.find(field.options, { value: value || field.default });
                    if (option) {
                        parts.push(option.label);
                    }
                } else if (value) {
                    parts.push(value);
                }
            });

            return parts.length ? parts.join(' · ') : this.__('click to configure');
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

        __(str) {
            return str;
        }
    }
}
</script>
