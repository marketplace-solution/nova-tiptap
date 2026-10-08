/**
 * Declarative config of the widget types available in the generic
 * widget-content-block. Adding a widget type here only drives the edit
 * form; the menu entry lives in the PHP field (contentBlocks) and the
 * front rendering in the app (WidgetBlockRenderer + Blade partial).
 *
 * Field attrs must be lowercase: DOM serialization lowercases attribute
 * names when the node is stored as HTML.
 *
 * Field shapes:
 * - input 'select': rendered as visual option tiles — options need
 *   { value, label, icon } (icon optional).
 * - input 'text' / 'number': label + placeholder + optional min/max.
 * - showIf: { attr: value } — field only visible when matching.
 */
export default {
    getyourguide: {
        label: 'Widget GetYourGuide',
        icon: '🎟️',
        accent: '#ff5533',
        summarize(attrs) {
            if (attrs.mode === 'tours') {
                return attrs.tourids
                    ? 'Activités précises : ' + attrs.tourids
                    : 'Activités précises : aucun ID renseigné';
            }

            return 'Recherche : ' + (attrs.query || 'destination du post')
                + ' · ' + (attrs.items || '3') + ' activités';
        },
        fields: [
            {
                attr: 'mode',
                label: 'Quelles activités afficher ?',
                input: 'select',
                default: 'search',
                options: [
                    { value: 'search', label: 'Recherche', icon: '🔍', hint: 'Les meilleures activités de la destination' },
                    { value: 'tours', label: 'Activités précises', icon: '🎯', hint: 'Une liste d\'IDs GetYourGuide' },
                ],
            },
            {
                attr: 'query',
                label: 'Recherche',
                input: 'text',
                default: '',
                placeholder: 'Vide = destination du post',
                showIf: { mode: 'search' },
            },
            {
                attr: 'tourids',
                label: 'IDs des activités',
                input: 'text',
                default: '',
                placeholder: 'Ex : 123456,654321 (séparés par des virgules)',
                showIf: { mode: 'tours' },
            },
            {
                attr: 'items',
                label: 'Nombre d\'activités',
                input: 'number',
                default: '3',
                min: 1,
                max: 9,
                showIf: { mode: 'search' },
            },
        ],
    },

    nenustay: {
        label: 'Widget Nenustay',
        icon: '🏨',
        accent: '#0ea5e9',
        summarize(attrs) {
            const displayLabels = {
                card: 'Carte hébergements',
                list: 'Mini-liste d\'établissements',
                button: 'Bouton simple',
            };

            let summary = displayLabels[attrs.display] || displayLabels.card;

            if (attrs.title) {
                summary += ' · « ' + attrs.title + ' »';
            }

            return summary;
        },
        fields: [
            {
                attr: 'display',
                label: 'Affichage',
                input: 'select',
                default: 'card',
                options: [
                    { value: 'card', label: 'Carte', icon: '🪧', hint: 'Encart cliquable avec titre' },
                    { value: 'list', label: 'Mini-liste', icon: '🛏️', hint: '3 hébergements de la destination' },
                    { value: 'button', label: 'Bouton', icon: '👆', hint: 'Simple bouton centré' },
                ],
            },
            {
                attr: 'title',
                label: 'Titre personnalisé',
                input: 'text',
                default: '',
                placeholder: 'Optionnel : remplace le titre par défaut',
            },
        ],
    },
}
