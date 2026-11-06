// Un <strong>/<em> qui enveloppe des blocs (HTML d'import mal formé : <strong><p>…</p><h3>…</h3></strong>) n'est
// pas une mise en forme voulue : sans ce garde, la marque s'étale sur tout le texte contenu et un save la rend
// explicite (<p><strong>…</strong></p>). La balise est ignorée, son contenu est parsé normalement.
const BLOCK_SELECTOR = "p, h1, h2, h3, h4, h5, h6, ul, ol, li, figure, table, blockquote, div, pre, hr, iframe";

export default function withoutBlockWrappers(rules) {
    return rules.map((rule) => {
        if (!rule.tag) {
            return rule;
        }

        return {
            ...rule,
            getAttrs: (node) => {
                if (node.querySelector(BLOCK_SELECTOR)) {
                    return false;
                }

                return rule.getAttrs ? rule.getAttrs(node) : null;
            },
        };
    });
}
