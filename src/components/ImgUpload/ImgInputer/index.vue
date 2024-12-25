<template>
  <div
    ref="box"
    class="img-inputer"
    :class="[
      themeClass,
      sizeClass,
      nhe || noHoverEffect ? 'nhe' : '',
      { 'img-inputer--loading': uploading },
    ]"
  >
    <i
      v-if="ICON && !customIconClass"
      class="img-inputer__icon"
      :class="`ico ico-${ICON}`"
    />
    <i
      v-if="customIconClass"
      class="img-inputer__icon"
      :class="customIconClass"
    />
    <slot v-if="!icon && !customIconClass" name="icon" />
    <p class="img-inputer__placeholder">
      {{ placeholder }}
    </p>

    <div v-if="imgSelected" class="img-inputer__preview-box">
      <img :src="dataUrl" class="img-inputer__preview-img" />
    </div>
    <label :for="readonly ? '' : inputId" class="img-inputer__label" />

    <transition name="vip-fade">
      <div v-if="uploading" class="img-inputer__loading">
        <div class="img-inputer__loading-indicator" />
        <div class="img-inputer__loading-process" :style="processStyle" />
      </div>
    </transition>

    <transition name="vip-zoom-in">
      <div v-if="autoUpload && uploaded" class="img-inputer__state success" />
    </transition>

    <transition name="vip-zoom-in">
      <div v-if="autoUpload && uploadFailed" class="img-inputer__state fail" />
    </transition>

    <!-- Mask -->
    <div v-if="imgSelected && !noMask" class="img-inputer__mask">
      <p class="img-inputer__file-name">
        {{ fileName }}
      </p>
      <p v-if="readonly" class="img-inputer__change">
        {{ readonlyTipText }}
      </p>
      <p v-else class="img-inputer__change">
        {{ bottomText }}
      </p>
    </div>

    <input
      v-if="capture"
      v-bind="$attrs"
      :id="inputId"
      ref="inputer"
      type="file"
      :name="name"
      :accept="accept"
      capture="video"
      class="img-inputer__inputer"
      @change="handleFileChange"
    />

    <!-- Alternative for no capture-->
    <input
      v-else
      v-bind="$attrs"
      :id="inputId"
      ref="inputer"
      type="file"
      :name="name"
      :accept="accept"
      class="img-inputer__inputer"
      @change="handleFileChange"
    />
    <transition name="vip-move-in">
      <div v-if="errText.length" class="img-inputer__err">
        {{ errText }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import ajax from "./ajax";

const isZhCN = _ =>
  (navigator.language || navigator.browserLanguage).includes("zh");

const lang = isZhCN ? "zh" : "en";

const TRANSLATIONS = {
  readonlyTipText: { zh: "不可更改", en: "Readonly" },
  bottomText: {
    zh: "点击或拖拽图片以修改",
    en: "Drop file here or click to change"
  },
  hoverText: {
    zh: "点击或拖拽图片以修改",
    en: "Drop file here or click to change"
  },
  placeholder: {
    zh: "点击或拖拽选择图片",
    en: "Drop file here or click"
  },
  noMultipleFileMsg: { zh: "不支持多文件", en: "Not support multiple files" },
  exceedSizeMsg: {
    zh: "文件大小不能超过",
    en: "The size of file should less than: "
  },
  noActionUrlMsg: {
    zh: "上传地址未配置",
    en: "Action hasn't set up yet"
  }
};

export default {
  name: "ImgInputer",

  // !------------------------ P r o p s --------------------------------------------------------
  props: {
    type: {
      default: "img",
      type: String
    },
    accept: {
      default: "image/*,video/*",
      type: String
    },
    capture: {
      default: false,
      type: Boolean
    },
    id: {
      default: "",
      type: String
    },
    onChange: {
      default: null,
      type: Function
    },
    readonly: {
      type: Boolean,
      default: false
    },
    noMultipleText: {
      default: TRANSLATIONS.noMultipleFileMsg[lang],
      type: String
    },
    exceedSizeText: {
      default: TRANSLATIONS.exceedSizeMsg[lang],
      type: String
    },
    noActionText: {
      default: TRANSLATIONS.noActionUrlMsg[lang],
      type: String
    },
    readonlyTipText: {
      default: TRANSLATIONS.readonlyTipText[lang],
      type: String
    },
    bottomText: {
      default: TRANSLATIONS.bottomText[lang],
      type: String
    },
    hoverText: {
      default: TRANSLATIONS.hoverText[lang],
      type: String
    },
    placeholder: {
      default: TRANSLATIONS.placeholder[lang],
      type: String
    },
    value: {
      default: undefined
    },
    icon: {
      default: "",
      type: String
    },
    aliIcon: {
      default: "",
      type: String
    },
    customIconClass: {
      default: "",
      type: String
    },
    maxSize: {
      default: 5120,
      type: Number
    },
    size: {
      default: "",
      type: String
    },
    imgSrc: {
      default: "",
      type: String
    },

    // ! Deprecated, use noHoverEffect instead
    nhe: {
      type: Boolean,
      default: false
    },
    noHoverEffect: {
      type: Boolean,
      default: false
    },
    noMask: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: "file"
    },

    // 文件自动上传功能抄自 Element/Uploader:
    autoUpload: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: undefined
    },
    uploadKey: {
      type: String,
      default: "file"
    },
    extraData: {
      type: Object,
      default: () => {}
    },
    headers: {
      type: Object,
      default: () => {}
    },
    withCookie: {
      type: Boolean,
      default: false
    },
    onStart: {
      default: () => {},
      type: Function
    },
    onProgress: {
      default: () => {},
      type: Function
    },
    onSuccess: {
      default: () => {},
      type: Function
    },
    onError: {
      default: () => {},
      type: Function
    }
  },

  // !------------------------ D a t a --------------------------------------------------------
  data() {
    return {
      inputId: "",
      file: null,
      dataUrl: "",
      fileName: "",
      errText: "",

      uploading: false,
      uploadPercent: 0,
      uploaded: false,
      uploadFailed: false
    };
  },

  // !------------------------ C o m p u t e d --------------------------------------------------------
  computed: {
    imgSelected() {
      return !!this.dataUrl || !!this.fileName;
    },

    sizeHumanRead() {
      let rst = 0;
      if (this.maxSize < 1024) {
        rst = this.maxSize + "K";
      } else {
        rst =
          (this.maxSize / 1024).toFixed(this.maxSize % 1024 > 0 ? 2 : 0) + "M";
      }
      return rst;
    },

    sizeClass() {
      if (this.size) {
        return `img-inputer--${this.size}`;
      }
    },

    themeClass() {
      return `img-inputer--${this.theme}`;
    },

    ICON() {
      let rst = "";
      const { theme, icon, autoUpload } = this;

      if (icon) {
        rst = icon;
      } else {
        rst = theme === "light" ? "img-light" : autoUpload ? "upload" : "clip";
      }
      return rst;
    },

    processStyle() {
      const { uploadPercent } = this;
      return {
        transform: `translate3d(${uploadPercent - 100}%, 0, 0)`
      };
    }
  },

  // !------------------------ L i f e   c i r c l e --------------------------------------------------------
  mounted() {
    this.inputId = this.id || this.generateID();

    if (this.imgSrc) {
      this.dataUrl = this.imgSrc;
    }

    // 阻止浏览器默认的拖拽时事件
    ["dragleave", "drop", "dragenter", "dragover"].forEach(e => {
      this.preventDefaultEvent(e);
    });

    // 绑定拖拽支持
    this.addDropSupport();
  },

  // !------------------------ M e t h o d s --------------------------------------------------------
  methods: {
    preventDefaultEvent(eventName) {
      document.addEventListener(
        eventName,
        function(e) {
          e.preventDefault();
        },
        false
      );
    },

    addDropSupport() {
      let BOX = this.$refs.box;

      BOX.addEventListener("drop", e => {
        e.preventDefault();
        if (this.readonly) return false;
        this.errText = "";
        let fileList = e.dataTransfer.files;

        if (fileList.length === 0) {
          return false;
        }

        if (fileList.length > 1) {
          this.errText = this.noMultipleText;
          return false;
        }

        this.handleFileChange(fileList);
      });
    },

    generateID() {
      let uuid = Math.random()
        .toString(36)
        .substring(3, 8);
      if (!document.getElementById(uuid)) {
        return uuid;
      } else {
        return this.generateID();
      }
    },

    handleFileChange(e) {
      if (typeof e.target === "undefined") this.file = e[0];
      else this.file = e.target.files[0];

      this.errText = "";
      let size = Math.floor(this.file.size / 1024);
      if (size > this.maxSize) {
        this.errText = `${this.exceedSizeText}${this.sizeHumanRead}`;
        this.$emit("onExceed", this.file);
        return false;
      }

      // 双向绑定
      this.$emit("input", this.file);

      if (this.autoUpload) this.uploadFile();

      this.onChange && this.onChange(this.file, this.file.name);
      this.$emit("onChange", this.file, this.file.name);

      this.imgPreview(this.file);

      this.fileName = this.file.name;

      this.resetInput();
    },

    imgPreview(file) {
      let self = this;

      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function() {
          self.dataUrl = this.result;
        };
      }
    },

    resetInput() {
      let input = document.getElementById(this.inputId);
      let form = document.createElement("form");

      document.body.appendChild(form);

      let parentNode = input.parentNode;
      // 判断input 是否为最后一个节点
      let isLastNode = parentNode.lastChild === input;
      let nextSibling;

      // 如果后面还有节点，则记录下一个node，做位置标志
      // 如果本身已经是最后一个节点，则直接通过parentNode appendChild即可
      if (!isLastNode) {
        nextSibling = input.nextSibling;
      }

      form.appendChild(input);
      form.reset();

      isLastNode
        ? parentNode.appendChild(input)
        : parentNode.insertBefore(input, nextSibling);

      document.body.removeChild(form);
    },

    uploadFile() {
      const { onStart, file } = this;
      if (!this.action) {
        this.errText = this.noActionText;
        return;
      }

      onStart && onStart(file);

      this.post(file);
    },

    post(file) {
      const { headers, withCookie, extraData, uploadKey, action } = this;
      this.uploading = true;

      const options = {
        headers: headers,
        withCredentials: withCookie,
        file,
        data: extraData,
        filename: uploadKey,
        action,

        onProgress: e => {
          this.uploadPercent = ~~e.percent;
          this.onProgress(e, file);
        },

        onSuccess: res => {
          this.uploadPercent = 0;
          this.uploading = false;
          this.uploaded = true;
          this.onSuccess(res, file);
        },

        onError: err => {
          this.uploadPercent = 0;
          this.uploading = false;
          this.uploadFailed = true;
          this.onError(err, file);
        }
      };

      ajax(options);
    },

    reset() {
      this.file = null;
      this.dataUrl = "";
      this.errText = "";
      this.fileName = "";
      this.uploadPercent = 0;
      this.uploading = false;
      this.uploaded = false;
      this.uploadFailed = false;
    }
  },

  // !------------------------ W a t c h --------------------------------------------------------
  watch: {
    imgSrc(newVal) {
      this.dataUrl = newVal;

      if (!newVal) {
        this.file = null;
        this.errText = "";
        this.fileName = "";
      }
    },

    value(newVal, oldVal) {
      // reset
      if (oldVal && !newVal) {
        this.reset();
      }
    }
  }
};
</script>

<style lang="scss">
@use "./style/index";
</style>