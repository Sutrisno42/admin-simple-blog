<template>
    <div ref="editorElement">
      <ckeditor
        v-if="editor && config"
        :modelValue="modelValue"
        :editor="editor"
        :config="config"
        @update:modelValue="updateContent"
      />
    </div>
  </template>
  
  <script setup>
  import { computed, ref, onMounted, defineProps, defineEmits } from 'vue';
  import { Ckeditor } from '@ckeditor/ckeditor5-vue';
  
  import {
    ClassicEditor,
    Alignment,
    Autoformat,
    AutoLink,
    Autosave,
    BlockQuote,
    Bold,
    CloudServices,
    Essentials,
    Heading,
    ImageInline,
    ImageInsertViaUrl,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    ListProperties,
    MediaEmbed,
    Mention,
    Paragraph,
    PasteFromOffice,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline
  } from 'ckeditor5';
  
  import 'ckeditor5/ckeditor5.css';
  
  const props = defineProps({
    modelValue: String,
    toolbarType: {
      type: String,
      default: 'default', // default | full | minimal
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  const LICENSE_KEY = 'GPL'; // Ganti sesuai lisensi kamu
  
  const isLayoutReady = ref(false);
  const editor = ClassicEditor;
  
  // Menentukan toolbar berdasarkan jenis toolbarType
  const toolbarItems = computed(() => {
    if (props.toolbarType === 'full') {
      return [
        'heading',
        '|',
        'bold', 'italic', 'underline',
        'link', 'mediaEmbed', 'insertTable', 'blockQuote',
        '|',
        'alignment',
        'bulletedList', 'numberedList', 'todoList',
        'outdent', 'indent',
        '|',
        'undo', 'redo'
      ];
    } else if (props.toolbarType === 'minimal') {
      return [
        'heading'
      ];
    } else {
      // Default toolbar
      return [
        'heading',
        '|',
        'bold', 'italic', 'underline',
        '|',
        'link', 'mediaEmbed', 'insertTable', 'blockQuote',
        '|',
        'alignment',
        '|',
        'bulletedList', 'numberedList', 'todoList',
        'outdent', 'indent'
      ];
    }
  });
  
  // Konfigurasi CKEditor
  const config = computed(() => {
    if (!isLayoutReady.value) {
      return null;
    }
  
    return {
      toolbar: {
        items: toolbarItems.value,
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        Alignment,
        Autoformat,
        AutoLink,
        Autosave,
        BlockQuote,
        Bold,
        CloudServices,
        Essentials,
        Heading,
        ImageInline,
        ImageInsertViaUrl,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        ListProperties,
        MediaEmbed,
        Mention,
        Paragraph,
        PasteFromOffice,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline
      ],
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
          { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
          { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
          { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
        ]
      },
      image: {
        toolbar: ['imageTextAlternative']
      },
      initialData: '',
      licenseKey: LICENSE_KEY,
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file'
            }
          }
        }
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true
        }
      },
      mention: {
        feeds: [
          {
            marker: '@',
            feed: []
          }
        ]
      },
      placeholder: 'Type or paste your content here!',
      table: {
        contentToolbar: [
          'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'
        ]
      }
    };
  });
  
  // Emit perubahan konten
  const updateContent = (value) => {
    emit('update:modelValue', value);
  };
  
  // Tunggu layout siap
  onMounted(() => {
    isLayoutReady.value = true;
  });
  </script>
  