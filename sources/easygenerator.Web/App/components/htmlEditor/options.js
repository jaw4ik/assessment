let toolbarButtons = [
    'paragraphFormat', 'bold', 'italic', 'underline', 'mark', '|',
    'insertLink', '|',
    'align-left', 'align-center', 'align-right', 'align-justify', '|',
    'formatUL', 'formatOL'
];

export default{
    basicHtmlEditor: {
            initOnClick: true,
            placeholderText: '',
            spellcheck: true,
            editorClass: 'froala-editor',
            theme: 'easygenerator',
            // toolbar
            toolbarButtons: toolbarButtons,
            toolbarButtonsMD: toolbarButtons,
            toolbarButtonsSM: toolbarButtons,
            toolbarButtonsXS: toolbarButtons,
            toolbarSticky: false,
            scrollableContainer: '.question-view-holder-wrapper',
            // link
            linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
            linkInsertButtons: ['linkBack'],
            linkStyles: {},
            linkList: [],
            // paragraph format
            paragraphFormatSelection: true,
            paragraphFormat: {
                N: 'Normal',
                H1: 'Heading 1',
                H2: 'Heading 2',
                H3: 'Heading 3',
                CITE: 'Quote'
            },
            // html 
            htmlAllowComments: false,
            htmlAllowedAttrs: ['title', 'href', 'alt', 'src', 'style'],
            htmlAllowedEmptyTags: [],
            htmlAllowedTags: ['p', 'h1', 'h2', 'h3', 'cite', 'mark', 'a', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
            // paste
            pasteDeniedAttrs: ['class', 'id']
    }
};