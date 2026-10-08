<template>
    <span>
        <Modal
            :show="linkMenuIsActive"
            tabindex="-1"
        >
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <template v-if="withFileUpload">
                    <div class="px-6 pt-4">
                        <span
                            class="inline-block uppercase cursor-pointer font-bold text-sm border-b mr-4"
                            :class="{
                                'text-primary-500 border-primary-500': linkMode == 'url',
                                'text-gray-500 border-transparent': linkMode != 'url',
                            }"
                            @click="linkMode = 'url'"
                            v-text="ttt('url')"
                        >
                        </span>

                        <span
                            class="inline-block uppercase cursor-pointer font-bold text-sm border-b"
                            :class="{
                                'text-primary-500 border-primary-500': linkMode == 'file',
                                'text-gray-500 border-transparent': linkMode != 'file',
                            }"
                            @click="linkMode = 'file'"
                            v-text="ttt('file upload')"
                        >
                        </span>
                    </div>
                </template>

                <div
                    class="px-6"
                    style="padding-bottom: 32px; padding-top: 32px"
                >
                    <div v-show="linkMode == 'url'">
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

                            <div
                                class="ml-1 mt-1 help-text"
                                v-text="ttt('external links should start with http:// or https://')"
                            ></div>

                            <div class="flex items-center mt-3">
                                <Checkbox
                                    @input="openInNewWindow = !openInNewWindow"
                                    :id="'openInNewWindow_' + field.attribute"
                                    :checked="openInNewWindow"
                                />
                                <label
                                    class="text-sm ml-2"
                                    :for="'openInNewWindow_' + field.attribute"
                                    v-text="ttt('open in new window')"
                                >
                                </label>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="withFileUpload"
                        v-show="linkMode == 'file'"
                    >
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
                                    class="w-full h-full absolute top-0 left-0 cursor-pointer opacity-0"
                                />
                                <span v-text="ttt('select file')"></span>
                            </label>

                            <div
                                class="h-16 flex items-center"
                                style="margin-left: 16px"
                            >
                                <span
                                    v-if="!file"
                                    v-text="ttt('no file selected')"
                                >
                                </span>

                                <span
                                    v-if="file"
                                    v-text="filename"
                                >
                                </span>
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

                    <div class="mt-8">
                        <label
                            class="block text-sm mb-1 ml-1"
                            v-text="ttt('custom css classes')"
                        >
                        </label>

                        <input
                            class="w-full form-control form-input form-control-bordered"
                            type="text"
                            v-model="extraClasses"
                        />

                        <label
                            class="block text-sm mt-3 mb-1 ml-1"
                            v-text="ttt('title')"
                        >
                        </label>

                        <input
                            class="w-full form-control form-input form-control-bordered"
                            type="text"
                            v-model="title"
                        />

                        <label
                            class="block text-sm mt-8 mb-1 ml-1"
                            v-text="ttt('link attributes')"
                        >
                        </label>

                        <div
                            class="rounded-lg bg-gray-100 dark:bg-gray-700"
                            style="padding: 4px 12px;"
                        >
                            <div
                                v-for="(option, index) in linkAttributeOptions"
                                :key="option.key"
                                class="flex"
                                :style="{
                                    padding: '10px 0',
                                    borderBottom: index < linkAttributeOptions.length - 1
                                        ? '1px solid rgba(125, 125, 125, 0.2)'
                                        : 'none',
                                }"
                            >
                                <div style="flex-shrink: 0; padding-top: 2px;">
                                    <Checkbox
                                        @input="$data[option.key] = !$data[option.key]"
                                        :id="option.key + '_' + field.attribute"
                                        :checked="$data[option.key]"
                                    />
                                </div>

                                <label
                                    class="ml-2 cursor-pointer"
                                    style="flex: 1; min-width: 0;"
                                    :for="option.key + '_' + field.attribute"
                                >
                                    <span class="flex items-center">
                                        <span
                                            class="text-sm font-bold"
                                            v-text="option.label"
                                        ></span>

                                        <code
                                            class="ml-2 bg-white dark:bg-gray-800 rounded"
                                            style="font-family: ui-monospace, monospace; font-size: 11px; padding: 1px 6px; border: 1px solid rgba(125, 125, 125, 0.25);"
                                            v-text="option.badge"
                                        ></code>
                                    </span>

                                    <span
                                        class="block help-text"
                                        style="margin-top: 2px;"
                                        v-text="option.help"
                                    ></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-100 dark:bg-gray-700 px-6 py-3">
                    <div class="flex items-center justify-end">
                        <Button
                            class="mr-4"
                            dusk="cancel-link-button"
                            variant="ghost"
                            :label="ttt('cancel')"
                            @click="hideLinkMenu"
                        />

                        <Button
                            dusk="set-link-button"
                            type="button"
                            @click="linkMode == 'url' ? setLinkFromUrl($event) : uploadAndAddFile($event)"
                            :disabled="(linkMode == 'url' && !url) || (linkMode == 'file' && !file)"
                            :label="linkMode == 'url' ? ttt('set link') : ttt('upload and link file')"
                        />
                    </div>
                </div>
            </div>
        </Modal>

        <span class="whitespace-nowrap">
            <base-button
                :isActive="linkIsActive"
                :isDisabled="!linkCanBeUsed"
                :clickMethod="showLinkMenu"
                :title="!linkIsActive ? ttt('set link') : ttt('edit link')"
                :icon="['fas', 'link']"
            >
            </base-button>

            <base-button
                :isActive="linkIsActive"
                :isDisabled="!linkCanBeUsed"
                :clickMethod="unsetLink"
                :title="ttt('unset link')"
                :icon="['fas', 'unlink']"
            >
            </base-button>
        </span>
    </span>
</template>

<script>
import { Button } from "laravel-nova-ui";
import buttonHovers from "../../mixins/buttonHovers";

import { library } from "@fortawesome/fontawesome-svg-core";

import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BaseButton from "./BaseButton.vue";

import translations from "../../mixins/translations";

library.add(faTimesCircle);

export default {
    mixins: [buttonHovers, translations],

    props: ["button", "editor", "field", "mode", "fileDisk", "filePath"],

    data: function () {
        return {
            linkMenuIsActive: false,
            url: "",
            openInNewWindow: false,
            file: null,
            filename: null,
            uploadProgress: 0,
            uploading: false,
            extraClasses: "",
            linkMode: "url",
            title: "",
            nofollow: false,
            sponsored: false,
            noopener: false,
            noreferrer: false,
            obf: false,
        };
    },

    components: {
        FontAwesomeIcon,
        BaseButton,
        Button,
    },

    computed: {
        linkIsActive() {
            return this.editor ? this.editor.isActive("link") : false;
        },

        linkCanBeUsed() {
            return this.editor
                ? this.mode == "editor" && !this.editor.isActive("image")
                : true;
        },

        withFileUpload() {
            return !this.field.linkSettings
                ||
                (
                    typeof this.field.linkSettings.withFileUpload != "boolean"
                    || this.field.linkSettings.withFileUpload
                );
        },

        linkAttributeOptions() {
            return [
                {
                    key: "nofollow",
                    badge: 'rel="nofollow"',
                    label: this.ttt("nofollow label"),
                    help: this.ttt("nofollow help"),
                },
                {
                    key: "sponsored",
                    badge: 'rel="sponsored"',
                    label: this.ttt("sponsored label"),
                    help: this.ttt("sponsored help"),
                },
                {
                    key: "noopener",
                    badge: 'rel="noopener"',
                    label: this.ttt("noopener label"),
                    help: this.ttt("noopener help"),
                },
                {
                    key: "noreferrer",
                    badge: 'rel="noreferrer"',
                    label: this.ttt("noreferrer label"),
                    help: this.ttt("noreferrer help"),
                },
                {
                    key: "obf",
                    badge: 'obf="1"',
                    label: this.ttt("obf label"),
                    help: this.ttt("obf help"),
                },
            ];
        },
    },

    methods: {
        showLinkMenu() {
            if (this.linkIsActive) {
                let attributes = this.editor.getAttributes("link");
                this.url = attributes.href;
                this.openInNewWindow = attributes.target == "_blank" ? true : false;
                this.linkMode = attributes["tt-mode"] ? attributes["tt-mode"] : "url";
                this.extraClasses = attributes.class ? attributes.class : "";
                this.title = attributes.title ? attributes.title : "";
                this.nofollow = attributes.rel && attributes.rel.indexOf("nofollow") > -1 ? true : false;
                this.sponsored = attributes.rel && attributes.rel.indexOf("sponsored") > -1 ? true : false;
                this.noopener = attributes.rel && attributes.rel.indexOf("noopener") > -1 ? true : false;
                this.noreferrer = attributes.rel && attributes.rel.indexOf("noreferrer") > -1 ? true : false;
                this.obf = attributes.obf != null && attributes.obf !== false;
            } else {
                this.url = "";
                this.openInNewWindow = false;
                this.nofollow = false;
                this.sponsored = false;
                this.noopener = false;
                this.noreferrer = false;
                this.obf = false;
                this.linkMode = "url";
                this.extraClasses = "";
                this.title = "";
            }

            this.linkMenuIsActive = true;
        },

        hideLinkMenu() {
            this.linkMenuIsActive = false;
        },

        removeFile() {
            this.file = null;
            this.filename = null;
            this.$refs.fileInput.value = null;
        },

        resetUploading() {
            this.uploading = false;
            this.uploadProgress = 0;
        },

        changeFile(files) {
            if (files.length) {
                this.file = files[0];
                this.filename = this.file.name;
            }
        },

        uploadAndAddFile(e) {
            e.preventDefault();

            this.uploading = true;

            let data = new FormData();
            data.append("file", this.file);
            data.append("disk", this.fileDisk);
            data.append("path", this.filePath);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) =>
                    (this.uploadProgress =
                        (progressEvent.loaded / progressEvent.total) * 100),
            };

            axios
                .post("/nova-tiptap/api/file", data, config)
                .then(
                    function (response) {
                        this.resetUploading();
                        this.removeFile();

                        let startPosition = response.data.url.lastIndexOf("/");
                        let filename = response.data.url.substr(startPosition + 1);

                        let attributes = {
                            href: response.data.url,
                            "tt-mode": "file",
                            download: filename,
                        };

                        this.setLink(attributes);

                        this.hideLinkMenu();
                    }.bind(this)
                )
                .catch(
                    function (error) {
                        this.resetUploading();
                        this.removeFile();
                    }.bind(this)
                );
        },

        setLinkFromUrl(e) {
            e.preventDefault();

            let attributes = {
                href: this.url,
                "tt-mode": "url",
            };

            if (this.openInNewWindow) {
                attributes.target = "_blank";
            } else {
                attributes.target = "_self";
            }

            this.setLink(attributes);

            this.hideLinkMenu();
        },

        setLink(attributes) {
            if (this.extraClasses) {
                attributes.class = this.extraClasses;
            }
            if (this.title) {
                attributes.title = this.title;
            }
            if (this.obf) {
                attributes.obf = "1";
            }
            let rel = ["nofollow", "sponsored", "noopener", "noreferrer"]
                .filter((token) => this[token])
                .join(" ");

            if (rel) {
                attributes.rel = rel;
            }

            if (this.editor.isActive("image")) {
                let attributes = this.editor.getAttributes("image");
            } else {
                this.editor.chain().extendMarkRange("link").unsetLink().run();
                this.editor.chain().focus().setLink(attributes).run();
            }
        },

        unsetLink() {
            this.editor.chain().focus().unsetLink().run();
        },
    },
};
</script>
