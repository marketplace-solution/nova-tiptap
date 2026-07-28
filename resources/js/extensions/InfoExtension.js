import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'info',

    group: 'block',

    content: 'block+',

    defining: true,

    parseHTML() {
        return [
            { tag: 'div.info' },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { class: 'info' }), 0]
    },

    addCommands() {
        return {
            toggleInfo: () => ({ commands }) => {
                return commands.toggleWrap(this.name)
            },
        }
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-a': () => this.editor.commands.toggleInfo(),
        }
    },
})
