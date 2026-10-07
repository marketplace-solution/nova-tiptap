import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import WidgetContentBlock from './WidgetContentBlock.vue'

export default Node.create({
    name: 'widgetContentBlock',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        // Union of the attributes of every widget type (widgetTypes.js);
        // irrelevant ones stay at their default.
        return {
            type: {
                default: '',
            },
            mode: {
                default: 'search',
            },
            query: {
                default: '',
            },
            tourids: {
                default: '',
            },
            items: {
                default: '3',
            },
            display: {
                default: 'card',
            },
            title: {
                default: '',
            },
            key: {
                default: '',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'widget-content-block',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['widget-content-block', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return VueNodeViewRenderer(WidgetContentBlock)
    },
})
