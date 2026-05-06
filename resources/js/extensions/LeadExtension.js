import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'lead',

    group: 'block',

    content: 'block+',

    defining: true,

    parseHTML() {
        return [{ tag: 'div.lead' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { class: 'lead' }), 0]
    },

    addCommands() {
        return {
            toggleLead: () => ({ commands }) => {
                return commands.toggleWrap(this.name)
            },
        }
    },
})
