import {
  ClassicEditor as Editor,
} from '@ckeditor/ckeditor5-editor-classic/dist/index.js';
import '@ckeditor/ckeditor5-theme-lark/dist/index.css';
import { Essentials } from '@ckeditor/ckeditor5-essentials/dist/index.js';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
} from '@ckeditor/ckeditor5-basic-styles/dist/index.js';
import {
  FontFamily,
  FontSize,
  FontColor,
  FontBackgroundColor,
} from '@ckeditor/ckeditor5-font/dist/index.js';
import { Alignment } from '@ckeditor/ckeditor5-alignment/dist/index.js';
import { Heading } from '@ckeditor/ckeditor5-heading/dist/index.js';
import { List, TodoList } from '@ckeditor/ckeditor5-list/dist/index.js';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent/dist/index.js';
import { Link, LinkImage } from '@ckeditor/ckeditor5-link/dist/index.js';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote/dist/index.js';
import {
  Image,
  ImageUpload,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageResize,
  ImageTextAlternative,
} from '@ckeditor/ckeditor5-image/dist/index.js';
import {
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
} from '@ckeditor/ckeditor5-table/dist/index.js';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed/dist/index.js';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block/dist/index.js';
import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed/dist/index.js';
import { SpecialCharacters } from '@ckeditor/ckeditor5-special-characters/dist/index.js';
import { Undo } from '@ckeditor/ckeditor5-undo/dist/index.js';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing/dist/index.js';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line/dist/index.js';
import { PageBreak } from '@ckeditor/ckeditor5-page-break/dist/index.js';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace/dist/index.js';

export default class CustomCKEditor extends Editor {
  static builtinPlugins = [
    Essentials,
    Heading,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    FontFamily,
    FontSize,
    FontColor,
    FontBackgroundColor,
    Alignment,
    List,
    TodoList,
    Indent,
    IndentBlock,
    Link,
    LinkImage,
    BlockQuote,
    Image,
    ImageUpload,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageResize,
    ImageTextAlternative,
    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties,
    MediaEmbed,
    CodeBlock,
    HtmlEmbed,
    SpecialCharacters,
    Undo,
    SourceEditing,
    HorizontalLine,
    PageBreak,
    FindAndReplace,
  ];

  static defaultConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        '|',
        'fontColor',
        'fontBackgroundColor',
        'fontFamily',
        'fontSize',
        '|',
        'alignment',
        '|',
        'numberedList',
        'bulletedList',
        'todoList',
        '|',
        'outdent',
        'indent',
        '|',
        'link',
        'blockQuote',
        'imageUpload',
        'insertTable',
        'mediaEmbed',
        '|',
        'codeBlock',
        'htmlEmbed',
        '|',
        'horizontalLine',
        'pageBreak',
        '|',
        'specialCharacters',
        'findAndReplace',
        '|',
        'undo',
        'redo',
        '|',
        'sourceEditing',
      ],
      shouldNotGroupWhenFull: true,
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        'linkImage',
      ],
      styles: ['full', 'side', 'alignLeft', 'alignRight'],
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null,
        },
        {
          name: 'resizeImage:50',
          label: '50%',
          value: '50',
        },
        {
          name: 'resizeImage:75',
          label: '75%',
          value: '75',
        },
      ],
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties',
      ],
    },
    htmlEmbed: {
      showPreviews: true,
    },
    mediaEmbed: {
      previewsInData: true,
    },
  };
}
