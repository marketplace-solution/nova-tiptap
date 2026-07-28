<template>
  <PanelItem :index="index" :field="field">
    <template #value>
      <div class="tiptap-detail-content" v-html="field.value"></div>
    </template>
  </PanelItem>
</template>

<script>
export default {
  props: ['index', 'resource', 'resourceName', 'resourceId', 'field'],
}
</script>

<style scoped>
.tiptap-detail-content {
    line-height: 1.6;
    overflow-wrap: break-word;
    word-break: normal;
}

.tiptap-detail-content :deep(h2) {
    font-size: 1.6em;
    font-weight: 600;
    margin-top: 1em;
    padding-top: 0.4em;
}

.tiptap-detail-content :deep(h3) {
    font-size: 1.3em;
    margin-top: 1em;
    padding-top: 0.4em;
}

.tiptap-detail-content :deep(h4) {
    text-transform: uppercase;
    font-size: 0.9em;
    margin-top: 1em;
    padding-top: 0.4em;
}

.tiptap-detail-content :deep(blockquote) {
    display: block;
    margin: 1rem 0;
    padding: 1rem;
    border-left: 2px solid #3b82f6;
    background-color: #f3f4f6;
}

.tiptap-detail-content :deep(div.info) {
    display: block;
    padding: 1rem;
    margin: 1.5rem 0;
    border: 2px solid rgba(59, 130, 246, 0.25);
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tiptap-detail-content :deep(div.info > :first-child:is(h1, h2, h3, h4, h5, h6)) {
    margin-top: 0;
    padding-top: 0;
    padding-bottom: .5rem;
    margin-bottom: .75rem;
    border-bottom: 1px solid rgba(59, 130, 246, 0.15);
    font-size: 1.1rem;
}

.tiptap-detail-content :deep(div.lead) {
    font-size: 1.25rem;
    font-weight: 300;
    margin: 1.5em 0;
}

.tiptap-detail-content :deep(ul) {
    padding-left: 1.2rem;
    margin: 1em 0;
    list-style: disc;
}

.tiptap-detail-content :deep(ol) {
    padding-left: 1.2rem;
    margin: 1em 0;
    list-style: decimal;
}

.tiptap-detail-content :deep(a) {
    color: #0ea5e9;
    text-decoration: underline;
}

.tiptap-detail-content :deep(img) {
    max-width: 100%;
    height: auto;
}

.tiptap-detail-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    font-size: 0.9em;
}

.tiptap-detail-content :deep(table th),
.tiptap-detail-content :deep(table td) {
    border: 1px solid #e5e7eb;
    padding: 0.4rem 0.6rem;
}

.tiptap-detail-content :deep(table th) {
    background-color: #f3f4f6;
}
</style>
