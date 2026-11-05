import { Node, mergeAttributes } from '@tiptap/core'

// Iframe brute des anciens articles (vidéo YouTube…) : sans node dédié, l'éditeur la supprimait au chargement.
// Bloc atomique : elle sort de son <p> mais survit telle quelle.
export default Node.create({
    name: 'iframe',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return ['src', 'width', 'height', 'title', 'allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy']
            .reduce((attributes, name) => ({ ...attributes, [name]: { default: null } }), {})
    },

    parseHTML() {
        return [
            { tag: 'iframe[src]' },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['iframe', mergeAttributes(HTMLAttributes)]
    },
})
