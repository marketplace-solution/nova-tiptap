<template>
    <span style="z-index: 10">
        <Modal
            :show="imageMenuIsActive"
            tabindex="-1"
        >
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <template v-if="!imageIsActive && withFileUpload">
                    <div class="px-6 pt-4">
                        <span
                            class="inline-block uppercase cursor-pointer font-bold text-sm border-b mr-4"
                            :class="{
                                'text-primary-500 border-primary-500': imageMode == 'file',
                                'text-gray-500 border-transparent': imageMode != 'file',
                            }"
                            @click="imageMode = 'file'"
                            v-text="ttt('file upload')"
                        >
                        </span>

                        <span
                            class="inline-block uppercase cursor-pointer font-bold text-sm border-b"
                            :class="{
                                'text-primary-500 border-primary-500': imageMode == 'url',
                                'text-gray-500 border-transparent': imageMode != 'url',
                            }"
                            @click="imageMode = 'url'"
                            v-text="ttt('external url')"
                        >
                        </span>
                    </div>
                </template>

                <div
                    class="px-6"
                    style="padding-bottom: 32px; padding-top: 32px; max-height: 70vh; overflow-y: auto;"
                >
                    <div v-if="!imageIsActive">
                        <div v-if="withFileUpload" v-show="imageMode == 'file'">
                            <div
                                class="flex items-center transition-opacity duration-150"
                                :class="{
                                    'pointer-events-none opacity-50': uploading,
                                }"
                            >
                                <label
                                    class="relative inline-flex items-center justify-center border bg-primary-500 border-primary-500 hover:[&:not(:disabled)]:bg-primary-400 hover:[&:not(:disabled)]:border-primary-400 text-white dark:text-gray-900 rounded font-bold text-sm shadow h-9 px-3 cursor-pointer"
                                >
                                    <input
                                        ref="fileInput"
                                        type="file"
                                        @change="changeFile($event.target.files)"
                                        accept="image/*"
                                        class="w-full h-full absolute top-0 left-0 cursor-pointer opacity-0"
                                    />
                                    <span v-text="ttt('select file')"></span>
                                </label>

                                <div
                                    class="h-16 flex items-center"
                                    style="margin-left: 16px"
                                >
                                    <span
                                        v-if="!preview"
                                        v-text="ttt('no file selected')"
                                    >
                                    </span>
                                    <img
                                        v-if="preview"
                                        :src="preview"
                                        class="w-auto rounded"
                                        style="height: 64px"
                                    />
                                </div>

                                <div
                                    v-if="file"
                                    @click="removeFile()"
                                    class="cursor-pointer text-xl text-primary"
                                    style="margin-left: 16px"
                                >
                                    <font-awesome-icon :icon="['fas', 'trash-alt']">
                                    </font-awesome-icon>
                                </div>
                            </div>

                            <div
                                class="w-full h-2 mt-3"
                                :class="{
                                    'bg-gray-200': uploading,
                                }"
                            >
                                <div
                                    class="bg-primary-400 h-full"
                                    :style="{
                                        width: uploadProgress + '%',
                                    }"
                                ></div>
                            </div>
                        </div>

                        <div v-show="imageMode == 'url'">
                            <div class="flex flex-col">
                                <label
                                    class="text-sm mb-1 ml-1"
                                    v-text="ttt('url')"
                                >
                                </label>

                                <input
                                    class="w-full form-control form-input form-control-bordered"
                                    type="text"
                                    v-model="url"
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                    </div>

                    <div :class="{ 'mt-8': !imageIsActive }">
                        <div
                            v-if="imageIsActive && url"
                            class="flex items-center mb-4"
                        >
                            <img
                                :src="url"
                                class="w-auto rounded"
                                style="max-height: 80px; max-width: 160px; object-fit: contain;"
                            />
                        </div>

                        <label
                            class="block text-sm mb-1 ml-1"
                            v-text="ttt('display')"
                        >
                        </label>

                        <div
                            class="rounded-lg bg-gray-100 dark:bg-gray-700"
                            style="padding: 12px;"
                        >
                            <div
                                style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;"
                            >
                                <div class="flex flex-col">
                                    <label
                                        class="text-sm mb-1 ml-1"
                                        v-text="ttt('width')"
                                    >
                                    </label>

                                    <input
                                        class="w-full form-control form-input form-control-bordered"
                                        type="number"
                                        min="1"
                                        v-model="width"
                                        :placeholder="ttt('natural size')"
                                    />
                                </div>

                                <div class="flex flex-col">
                                    <label
                                        class="text-sm mb-1 ml-1"
                                        v-text="ttt('alignment')"
                                    >
                                    </label>

                                    <div class="flex" style="gap: 8px;">
                                        <button
                                            v-for="option in alignmentOptions"
                                            :key="option.value"
                                            type="button"
                                            class="flex items-center justify-center rounded cursor-pointer bg-white dark:bg-gray-800"
                                            :class="{
                                                'text-primary-500': alignment == option.value,
                                                'text-gray-500': alignment != option.value,
                                            }"
                                            :style="{
                                                flex: 1,
                                                height: '36px',
                                                border: alignment == option.value
                                                    ? '2px solid currentColor'
                                                    : '1px solid rgba(125, 125, 125, 0.35)',
                                            }"
                                            :title="ttt(option.label)"
                                            @click="alignment = option.value"
                                        >
                                            <font-awesome-icon :icon="['fas', option.icon]">
                                            </font-awesome-icon>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="help-text"
                                style="margin-top: 8px;"
                                v-text="ttt('display help')"
                            ></div>
                        </div>

                        <label
                            class="block text-sm mt-4 mb-1 ml-1"
                            v-text="ttt('caption')"
                        >
                        </label>

                        <input
                            class="w-full form-control form-input form-control-bordered"
                            type="text"
                            v-model="caption"
                        />

                        <div
                            class="ml-1 mt-1 help-text"
                            v-text="ttt('caption help')"
                        ></div>

                        <div
                            class="mt-4"
                            style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;"
                        >
                            <div class="flex flex-col">
                                <label
                                    class="text-sm mb-1 ml-1"
                                    v-text="ttt('alt text')"
                                >
                                </label>

                                <input
                                    class="w-full form-control form-input form-control-bordered"
                                    type="text"
                                    v-model="alt"
                                />
                            </div>

                            <div class="flex flex-col">
                                <label
                                    class="text-sm mb-1 ml-1"
                                    v-text="ttt('title')"
                                >
                                </label>

                                <input
                                    class="w-full form-control form-input form-control-bordered"
                                    type="text"
                                    v-model="title"
                                />
                            </div>
                        </div>

                        <label
                            class="block text-sm mt-4 mb-1 ml-1"
                            v-text="ttt('custom css classes')"
                        >
                        </label>

                        <div
                            class="flex items-center ml-1"
                            style="gap: 24px; margin-bottom: 8px;"
                        >
                            <div
                                v-for="preset in classPresets"
                                :key="preset.class"
                                class="flex items-center"
                            >
                                <Checkbox
                                    @input="toggleClassPreset(preset.class)"
                                    :id="'preset_' + preset.class + '_' + field.attribute"
                                    :checked="hasClassPreset(preset.class)"
                                />
                                <label
                                    class="text-sm ml-2 cursor-pointer flex items-center"
                                    :for="'preset_' + preset.class + '_' + field.attribute"
                                >
                                    <span v-text="preset.label"></span>
                                    <code
                                        class="ml-2 bg-gray-100 dark:bg-gray-700 rounded"
                                        style="font-family: ui-monospace, monospace; font-size: 11px; padding: 1px 6px; border: 1px solid rgba(125, 125, 125, 0.25);"
                                        v-text="preset.class"
                                    ></code>
                                </label>
                            </div>
                        </div>

                        <input
                            class="w-full form-control form-input form-control-bordered"
                            type="text"
                            v-model="extraClasses"
                        />
                    </div>
                </div>

                <div class="bg-gray-100 dark:bg-gray-700 px-6 py-3">
                    <div class="flex items-center justify-end">
                        <Button
                            class="mr-4"
                            dusk="cancel-image-button"
                            variant="ghost"
                            :label="ttt('cancel')"
                            @click="hideImageMenu"
                        />

                        <Button
                            dusk="set-image-button"
                            type="button"
                            :disabled="!imageIsActive && ((imageMode == 'url' && !url) || (imageMode == 'file' && !file))"
                            @click="imageIsActive ? updateImage($event) : (imageMode == 'url' ? addImageFromUrl($event) : uploadAndAddImage($event))"
                            :label="imageIsActive ? ttt('update image') : (imageMode == 'url' ? ttt('add image') : ttt('upload and add image'))"
                        />
                    </div>
                </div>
            </div>
        </Modal>

        <span class="whitespace-nowrap">
            <base-button
                :isActive="imageIsActive"
                :isDisabled="mode != 'editor'"
                :clickMethod="showImageMenu"
                :icon="['fas', 'image']"
                :title="!imageIsActive ? ttt('add image') : ttt('edit image')"
            >
            </base-button>
        </span>
    </span>
</template>

<script>
import { Button } from "laravel-nova-ui";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
    faAlignCenter,
    faAlignLeft,
    faAlignRight,
    faTimesCircle,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BaseButton from "./BaseButton.vue";

import translations from "../../mixins/translations";

library.add(faAlignCenter, faAlignLeft, faAlignRight, faTimesCircle, faTrashAlt);

const ALIGNMENT_MARGINS = {
    left: "0 auto 0 0",
    center: "auto",
    right: "0 0 0 auto",
};

export default {
    mixins: [translations],

    props: [
        "button",
        "editor",
        "field",
        "mode",
        "imageDisk",
        "imagePath",
    ],

    data: function () {
        return {
            imageMenuIsActive: false,
            file: null,
            preview: null,
            url: "",
            uploadProgress: 0,
            uploading: false,
            extraClasses: "",
            imageMode: "url",
            title: "",
            alt: "",
            caption: "",
            width: "",
            alignment: "left",
        };
    },

    components: {
        FontAwesomeIcon,
        BaseButton,
        Button,
    },

    computed: {
        // tiptap-extension-resize-image renomme le node en `imageResize` —
        // résoudre le nom réel depuis le schéma (jamais "image" en dur)
        imageNodeName() {
            if (this.editor && this.editor.schema.nodes.imageResize) {
                return "imageResize";
            }

            return "image";
        },

        imageIsActive() {
            return this.editor ? this.editor.isActive(this.imageNodeName) : false;
        },

        withFileUpload() {
            return !this.field.imageSettings
                ||
                (
                    typeof this.field.imageSettings.withFileUpload != "boolean"
                    || this.field.imageSettings.withFileUpload
                );
        },

        defaultMode() {
            return this.withFileUpload ? "file" : "url";
        },

        alignmentOptions() {
            return [
                { value: "left", icon: "align-left", label: "align start" },
                { value: "center", icon: "align-center", label: "align center" },
                { value: "right", icon: "align-right", label: "align end" },
            ];
        },

        classPresets() {
            return [
                { class: "rounded", label: this.ttt("rounded corners") },
                { class: "shadow", label: this.ttt("drop shadow") },
            ];
        },
    },

    methods: {
        showImageMenu() {
            if (this.imageIsActive) {
                let attributes = this.editor.getAttributes(this.imageNodeName);
                this.url = attributes.src;
                this.imageMode = attributes["tt-mode"] ? attributes["tt-mode"] : this.defaultMode;
                this.extraClasses = attributes.class ? attributes.class : "";
                this.title = attributes.title ? attributes.title : "";
                this.alt = attributes.alt ? attributes.alt : "";
                this.caption = attributes["data-caption"] ? attributes["data-caption"] : "";
                this.parseContainerStyle(attributes.containerStyle);
            } else {
                this.url = "";
                this.imageMode = this.defaultMode;
                this.extraClasses = "";
                this.title = "";
                this.alt = "";
                this.caption = "";
                this.width = "";
                this.alignment = "left";
            }

            this.imageMenuIsActive = true;
        },

        hideImageMenu() {
            this.imageMenuIsActive = false;
        },

        hasClassPreset(cls) {
            return this.extraClasses.split(/\s+/).includes(cls);
        },

        toggleClassPreset(cls) {
            const classes = this.extraClasses.split(/\s+/).filter(Boolean);
            const index = classes.indexOf(cls);

            index > -1 ? classes.splice(index, 1) : classes.push(cls);

            this.extraClasses = classes.join(" ");
        },

        parseContainerStyle(containerStyle) {
            this.width = "";
            this.alignment = "left";

            if (!containerStyle) {
                return;
            }

            const widthMatch = containerStyle.match(/width:\s*([0-9.]+)px/);
            if (widthMatch) {
                this.width = String(Math.round(parseFloat(widthMatch[1])));
            }

            const marginMatch = containerStyle.match(/margin:\s*([^;]+)/);
            if (!marginMatch) {
                return;
            }

            const tokens = marginMatch[1].trim().split(/\s+/);

            if (tokens.length === 1 && tokens[0] === "auto") {
                this.alignment = "center";
            } else if (tokens.length >= 4 && tokens[3] === "auto" && tokens[1] !== "auto") {
                this.alignment = "right";
            } else if (tokens.length >= 2 && tokens[1] === "auto" && (tokens.length < 4 || tokens[3] === "auto")) {
                this.alignment = "center";
            }
        },

        buildContainerStyle() {
            if (!this.width && this.alignment === "left") {
                return null;
            }

            let style = "";

            if (this.width) {
                style += `width: ${parseInt(this.width, 10)}px; `;
            }

            style += "height: auto; cursor: pointer;";

            if (this.alignment !== "left") {
                style += ` margin: ${ALIGNMENT_MARGINS[this.alignment]};`;
            }

            return style;
        },

        sharedAttributes() {
            return {
                class: this.extraClasses || null,
                title: this.title || null,
                alt: this.alt || null,
                "data-caption": this.caption || null,
                containerStyle: this.buildContainerStyle(),
            };
        },

        removeFile() {
            this.file = null;
            this.preview = null;
            this.$refs.fileInput.value = null;
        },

        resetUploading() {
            this.uploading = false;
            this.uploadProgress = 0;
        },

        changeFile(files) {
            if (files.length) {
                this.file = files[0];
                this.preview = URL.createObjectURL(this.file);
            }
        },

        addImageFromUrl(e) {
            e.preventDefault();

            let attributes = {
                src: this.url,
                "tt-mode": "url",
                ...this.sharedAttributes(),
            };

            this.editor.chain().focus().setImage(attributes).run();

            this.hideImageMenu();
        },

        uploadAndAddImage(e) {
            e.preventDefault();

            this.uploading = true;

            let data = new FormData();
            data.append("file", this.file);
            data.append("disk", this.imageDisk);
            data.append("path", this.imagePath);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) =>
                    (this.uploadProgress =
                        (progressEvent.loaded / progressEvent.total) * 100),
            };

            axios
                .post("/nova-tiptap/api/image", data, config)
                .then(
                    function (response) {
                        this.resetUploading();
                        this.removeFile();

                        let attributes = {
                            src: response.data.url,
                            "tt-mode": "file",
                            ...this.sharedAttributes(),
                        };

                        this.editor.chain().focus().setImage(attributes).run();

                        this.hideImageMenu();
                    }.bind(this)
                )
                .catch(
                    function (error) {
                        this.resetUploading();
                        this.removeFile();
                        console.log(error);
                    }.bind(this)
                );
        },

        updateImage(e) {
            e.preventDefault();

            this.editor
                .chain()
                .focus()
                .updateAttributes(this.imageNodeName, this.sharedAttributes())
                .run();

            this.hideImageMenu();
        },
    },
};
</script>
