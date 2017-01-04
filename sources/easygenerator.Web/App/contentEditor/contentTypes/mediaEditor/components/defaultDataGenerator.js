import constants from 'constants';
import _ from 'underscore';
import { className as textEditorClassName } from '../../editors/textEditor/index';
import { className as videoEditorClassName } from '../../editors/videoEditor/index';
import VideoFrame from '../../editors/videoEditor/components/videoFrame/viewmodel';

const defaultSize = {
    width: constants.storage.video.editorVideoFrameSize.width.value,
    height: constants.storage.video.editorVideoFrameSize.height.value
};

const defaultIframeSource = constants.storage.video.defaultIframeSource;

export function getDefaultDataByType(contentType, initialOptions = defaultSize) {
    let { width, height } = initialOptions;

    let videoFrameHtml = new VideoFrame(defaultIframeSource, width, height).toHtml();

    switch (contentType) {
        case constants.contentsTypes.singleVideo:
            return {
                0: [{ data: videoFrameHtml, type: videoEditorClassName }]
            };
        case constants.contentsTypes.videoWithText:
            return {
                0: [{ data: videoFrameHtml, type: videoEditorClassName }, { data: constants.templates.newEditorDefaultText, type: textEditorClassName }]
            };
        case constants.contentsTypes.videoInTheRight:
            return {
                0: [{ data: constants.templates.newEditorDefaultText, type: textEditorClassName }],
                1: [{ data: videoFrameHtml, type: videoEditorClassName }]
            };
        case constants.contentsTypes.videoInTheLeft:
            return {
                0: [{ data: videoFrameHtml, type: videoEditorClassName }],
                1: [{ data: constants.templates.newEditorDefaultText, type: textEditorClassName }]
            };
        default:
            throw `Unsupported content type -> ${contentType}`;
    }
}
