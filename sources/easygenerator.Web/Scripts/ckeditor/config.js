/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    config.skin = 'moono';

    config.toolbar = [
        ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', '-', 'RemoveFormat'],
        ['NumberedList', 'BulletedList'],
        ['Link', 'Unlink', 'Table', 'Image'],
        ['Format']
    ];

    config.startupFocus = true;

    config.extraPlugins = 'customLocalizationPlugin';

    config.format_tags = 'abbr;acronym;blockquote;q;cite;dfn;address;code;samp;tt;em;strong;sub;sup;h1;h2;h3;h4;h5;h6;hr;article;section;aside;header;footer;mark;figcaption;figure;nav;time';
    config.format_abbr = { element: 'abbr' };
    config.format_acronym = { element: 'acronym' };
    config.format_blockquote = {  element: 'blockquote' };
    config.format_q = { element: 'q' };
    config.format_cite = { element: 'cite' };
    config.format_dfn = { element: 'dfn' };
    config.format_address = { element: 'address' };
    config.format_code = { element: 'code' };
    config.format_samp= { element: 'samp' };
    config.format_tt = { element: 'tt' };
    config.format_em = { element: 'em' };
    config.format_strong = { element: 'strong' };
    config.format_sub = { element: 'sub' };
    config.format_sup = { element: 'sup' };
    config.format_h1 = { element: 'h1' };
    config.format_h2 = { element: 'h2' };
    config.format_h3 = { element: 'h3' };
    config.format_h4 = { element: 'h4' };
    config.format_h5 = { element: 'h5' };
    config.format_h6 = { element: 'h6' };
    config.format_hr = { element: 'hr' };
    config.format_article = { element: 'article' };
    config.format_section = { element: 'section' };
    config.format_aside = { element: 'aside' };
    config.format_header = { element: 'header' };
    config.format_footer = { element: 'footer' };
    config.format_mark = { element: 'mark' };
    config.format_figcaption = { element: 'figcaption' };
    config.format_figure = { element: 'figure' };
    config.format_nav = { element: 'nav' };
    config.format_time = { element: 'time' };
};
