/**
 * Declarative config of the widget types available in the generic
 * widget-content-block. Adding a widget type here only drives the edit
 * form; the menu entry lives in the PHP field (contentBlocks) and the
 * front rendering in the app (WidgetBlockRenderer + Blade partial).
 *
 * Field attrs must be lowercase: DOM serialization lowercases attribute
 * names when the node is stored as HTML.
 */
export default {
    getyourguide: {
        label: 'Widget GetYourGuide',
        fields: [
            {
                attr: 'mode',
                label: 'Mode',
                input: 'select',
                default: 'search',
                options: [
                    { value: 'search', label: 'Recherche (vide = destination du post)' },
                    { value: 'tours', label: 'Activités précises (IDs)' },
                ],
            },
            {
                attr: 'query',
                label: 'Recherche (laisser vide pour la destination du post)',
                input: 'text',
                default: '',
                showIf: { mode: 'search' },
            },
            {
                attr: 'tourids',
                label: 'IDs des activités, séparés par des virgules (ex : 123456,654321)',
                input: 'text',
                default: '',
                showIf: { mode: 'tours' },
            },
            {
                attr: 'items',
                label: 'Nombre d\'activités',
                input: 'number',
                default: '3',
            },
        ],
    },

    nenustay: {
        label: 'Widget Nenustay',
        fields: [
            {
                attr: 'display',
                label: 'Affichage',
                input: 'select',
                default: 'card',
                options: [
                    { value: 'card', label: 'Carte hébergements (destination du post)' },
                    { value: 'list', label: 'Mini-liste d\'établissements' },
                    { value: 'button', label: 'Bouton simple' },
                ],
            },
            {
                attr: 'title',
                label: 'Titre personnalisé (optionnel)',
                input: 'text',
                default: '',
            },
        ],
    },
}
