import constants from 'constants';
import _ from 'underscore';
import { className as textEditorClassName } from '../../editors/textEditor/index';
import { className as imageEditorClassName } from '../../editors/imageEditor/index';

const imageGroups = ['animals', 'flowers'];

function getRandomImage() {
    return `//cdn.easygenerator.com/images/contentEditor/${getRandomImageGroup()}/img${Math.floor(Math.random() * 8) + 1}.jpg`;
}

function getRandomImageGroup() {
    return imageGroups[Math.floor(Math.random() * 2)];
}

export function getDefaultDataByType(contentType) {
    switch (contentType) {
        case constants.contentsTypes.imageEditorOneColumn:
            return {
                0: [
                    {
                        data: `<img src="${getRandomImage()}" alt="" />`,
                        type: imageEditorClassName
                    },
                    {
                        data: constants.templates.newEditorDefaultText,
                        type: textEditorClassName
                    }
                ]
            };
        case constants.contentsTypes.imageInTheLeft:
            return {
                0: [
                    {
                        data: `<img src="${getRandomImage()}" alt="" />`,
                        type: imageEditorClassName
                    }
                ],
                1: [
                    {
                        data: constants.templates.newEditorDefaultText,
                        type: textEditorClassName
                    }
                ]
            };
        case constants.contentsTypes.imageInTheRight:
            return {
                0: [
                    {
                        data: constants.templates.newEditorDefaultText,
                        type: textEditorClassName
                    }
                ],
                1: [
                    {
                        data: `<img src="${getRandomImage()}" alt="" />`,
                        type: imageEditorClassName
                    }
                ]
            };
        case constants.contentsTypes.imageEditorTwoColumns:
            return {
                0: [
                    {
                        data: `<img src="${getRandomImage()}" alt="" />`,
                        type: imageEditorClassName
                    },
                    {
                        data: constants.templates.newEditorDefaultText,
                        type: textEditorClassName
                    }
                ],
                1: [
                    {
                        data: `<img src="${getRandomImage()}" alt="" />`,
                        type: imageEditorClassName
                    },
                    {
                        data: constants.templates.newEditorDefaultText,
                        type: textEditorClassName
                    }
                ]
            };
        default:
            throw `Unsupported content type -> ${contentType}`;
    }
}
