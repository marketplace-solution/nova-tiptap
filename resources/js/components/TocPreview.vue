<template>
    <div class="tt-toc-preview" v-if="headings.length" v-show="visible">
        <div class="tt-toc-preview-card bg-gray-100 dark:bg-gray-800 rounded">
            <div class="tt-toc-preview-title">
                {{ trans("table of contents") }}
            </div>
            <ol class="tt-toc-preview-list">
                <li
                    v-for="(heading, index) in headings"
                    :key="index"
                    :class="'tt-toc-level-' + heading.level"
                >
                    <a
                        href="#"
                        :title="heading.text"
                        @click.prevent="goTo(heading)"
                    >
                        <span v-if="heading.level === 2" class="tt-toc-number">
                            {{ heading.number }}.
                        </span>
                        {{ heading.text }}
                    </a>
                </li>
            </ol>
            <p class="tt-toc-preview-note" v-if="h2Count < 3">
                {{ trans("toc minimum note") }}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            editor: {
                default: null,
            },
            visible: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                headings: [],
            };
        },

        computed: {
            h2Count() {
                return this.headings.filter((h) => h.level === 2).length;
            },
        },

        watch: {
            editor: {
                immediate: true,
                handler(editor, previous) {
                    if (previous) {
                        previous.off("update", this.refresh);
                    }
                    if (editor) {
                        editor.on("update", this.refresh);
                        this.refresh();
                    }
                },
            },
        },

        beforeUnmount() {
            if (this.editor) {
                this.editor.off("update", this.refresh);
            }
        },

        methods: {
            refresh() {
                if (!this.editor) {
                    return;
                }

                let headings = [];
                let number = 0;

                this.editor.state.doc.descendants((node, pos) => {
                    if (node.type.name !== "heading") {
                        return;
                    }
                    if (node.attrs.level < 2 || node.attrs.level > 4) {
                        return;
                    }
                    if (node.attrs.level === 2) {
                        number++;
                    }
                    headings.push({
                        level: node.attrs.level,
                        number: number,
                        text: node.textContent.trim() || "…",
                        pos: pos,
                    });
                });

                this.headings = headings;
            },

            goTo(heading) {
                // La position peut avoir bougé depuis le dernier refresh : re-résoudre
                // le heading par son rang plutôt que de faire confiance à pos.
                this.refresh();
                let target = this.headings.find(
                    (h) => h.level === heading.level && h.number === heading.number && h.text === heading.text
                ) || heading;

                this.editor
                    .chain()
                    .setTextSelection(target.pos + 1)
                    .focus(null, { scrollIntoView: false })
                    .run();

                let dom = this.editor.view.nodeDOM(target.pos);
                if (dom && dom.scrollIntoView) {
                    dom.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            },

            trans(str) {
                return Nova.config("tiptapTranslations")[str] || str;
            },
        },
    };
</script>

<style lang="scss">
    .tt-toc-preview {
        position: absolute;
        left: 100%;
        top: 0;
        bottom: 0;
        width: 340px;
        padding-left: 24px;

        @media (max-width: 1500px) {
            display: none;
        }
    }

    .tt-toc-preview-card {
        position: sticky;
        top: 60px;
        max-height: calc(100vh - 120px);
        overflow-y: auto;
        padding: 14px 16px;
        font-size: 13px;
        line-height: 1.4;
    }

    .tt-toc-preview-title {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.6;
        margin-bottom: 8px;
    }

    .tt-toc-preview-list {
        margin: 0;
        padding: 0;
        list-style: none;

        li {
            margin: 0;

            a {
                display: block;
                padding: 3px 0;
                color: inherit;
                text-decoration: none;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &:hover {
                    color: rgb(14, 165, 233);
                }
            }

            .tt-toc-number {
                opacity: 0.5;
            }

            &.tt-toc-level-2 a {
                font-weight: 500;
            }

            &.tt-toc-level-3 a {
                padding-left: 16px;
                opacity: 0.75;
            }

            &.tt-toc-level-4 a {
                padding-left: 32px;
                font-size: 12px;
                opacity: 0.6;
            }
        }
    }

    .tt-toc-preview-note {
        margin-top: 10px;
        font-size: 11px;
        font-style: italic;
        opacity: 0.55;
    }
</style>
