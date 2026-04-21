import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'aside',

    group: 'block',

    content: 'block+',

    defining: true,

    parseHTML() {
        return [{ tag: 'aside' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['aside', mergeAttributes(HTMLAttributes), 0]
    },

    addCommands() {
        return {
            toggleAside: () => ({ commands }) => {
                return commands.toggleWrap(this.name)
            },
        }
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-a': () => this.editor.commands.toggleAside(),
        }
    },
})
