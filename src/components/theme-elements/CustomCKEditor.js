import { ClassicEditor as Editor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
} from '@ckeditor/ckeditor5-basic-styles';
import { FontFamily, FontSize, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { List, TodoList } from '@ckeditor/ckeditor5-list';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import {
  Image,
  ImageUpload,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageResize,
} from '@ckeditor/ckeditor5-image';
import {
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
} from '@ckeditor/ckeditor5-table';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed';
import { SpecialCharacters } from '@ckeditor/ckeditor5-special-characters';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { PageBreak } from '@ckeditor/ckeditor5-page-break';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';

export default class CustomCKEditor extends Editor {
  static builtinPlugins = [
    Essentials,
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
    Image,
    ImageUpload,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageResize,
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
