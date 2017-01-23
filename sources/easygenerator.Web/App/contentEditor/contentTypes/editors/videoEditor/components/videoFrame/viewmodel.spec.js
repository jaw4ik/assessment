import _ from 'underscore';
import ko from 'knockout';
import binder from 'binder';
import constants from 'constants';
import VideoFrameViewModel from './viewmodel';

describe('viewmodel [videoFrame]', () => {

    let viewModel = new VideoFrameViewModel();

    let src = ko.observable('src'),
        width = ko.observable('width'),
        height = ko.observable('height');

    let html, params;
    
    it('should return ctor function', () => {
        expect(VideoFrameViewModel).toBeFunction();
    });

    beforeAll(() => {
        viewModel.update('prop1', 'prop2', 'prop3');
        html = viewModel.toHtml();
    });

    describe('ctor', () => {
        beforeEach(() => {
            spyOn(binder, 'bindClass');
        });

        it('should bind class', () => {
            viewModel = new VideoFrameViewModel(src, width, height);
            expect(binder.bindClass).toHaveBeenCalled();
        });

        it('should initialize fields', () => {
            expect(viewModel.width).toBeObservable();
            expect(viewModel.height).toBeObservable();
            expect(viewModel.src).toBeObservable();
        });
    });    

    describe('update:', () => {

        beforeEach(() => {
            viewModel.update('prop1', 'prop2', 'prop3');
        });

        it('should update fields', () => {
            expect(viewModel.width()).toBe('prop2');
            expect(viewModel.height()).toBe('prop3');
            expect(viewModel.src()).toBe('prop1');
        });
    });

    describe('toHtml:', () => {
        let _html;

        beforeEach(() => {
            viewModel.update('prop1', 'prop2', 'prop3');
            _html = viewModel.toHtml();
        });

        it('should be typeof string', () => {
            expect(_html).toEqual(jasmine.any(String));
        });

        it('should includes src prop', () => {
            expect(_html.indexOf(viewModel.src()) !== -1).toBeTruthy();
        });

        it('should includes width prop', () => {
            expect(_html.indexOf(viewModel.width()) !== -1).toBeTruthy();
        });

        it('should includes height prop', () => {
            expect(_html.indexOf(viewModel.height()) !== -1).toBeTruthy();
        });
    });

    describe('getFrameParamsFromHtml:', () => {
        
        beforeEach(() => {
            params = VideoFrameViewModel.getFrameParamsFromHtml(html);
        });

        it('should return object', () => {
            expect(params).toEqual(jasmine.any(Object));
        });

        it('should return object with src prop', () => {
            expect(params.src).toEqual(jasmine.any(String));
        });

        it('should return object with width prop', () => {
            expect(params.width).toEqual(jasmine.any(String));
        });

        it('should return object with height prop', () => {
            expect(params.height).toEqual(jasmine.any(String));
        });
    });

    describe('_getFrameParamFromHtmlByName:', () => {
        
        it('should return src prop', () => {
            let prop1 = VideoFrameViewModel._getFrameParamFromHtmlByName('src', html);
            expect(prop1).toEqual('prop1');
        });

        it('should return width prop', () => {
            let prop2 = VideoFrameViewModel._getFrameParamFromHtmlByName('width', html);
            expect(prop2).toEqual('prop2');
        });

        it('should return height prop', () => {
            let prop3 = VideoFrameViewModel._getFrameParamFromHtmlByName('height', html);
            expect(prop3).toEqual('prop3');
        });

        it('should return undefined', () => {
            let undefinedProp = VideoFrameViewModel._getFrameParamFromHtmlByName('undefined', html);
            expect(undefinedProp).toBe(undefined);
        });
    });

    describe('isFrameValid:', () => {
        
        it('should fail validation', () => {
            expect(VideoFrameViewModel.isFrameValid('lorem ipsum')).toBeFalsy();
            expect(VideoFrameViewModel.isFrameValid(`<iframe src=\'https://www.youtube.com/watch?v=uuHWom0rG8Q\'>`)).toBeFalsy();
            expect(VideoFrameViewModel.isFrameValid(`<iframe>`)).toBeFalsy();
            expect(VideoFrameViewModel.isFrameValid(`<iframe </iframe>`)).toBeFalsy();
            expect(VideoFrameViewModel.isFrameValid(`</iframe>`)).toBeFalsy();
            expect(VideoFrameViewModel.isFrameValid(`<height=\'\'></iframe>`)).toBeFalsy();
        });

        it('should pass validation', () => {
            expect(VideoFrameViewModel.isFrameValid(`<iframe src=\'https://www.youtube.com/watch?v=uuHWom0rG8Q \'></iframe>`)).toBeTruthy();
            expect(VideoFrameViewModel.isFrameValid(`<iframe width=\'100\'></iframe>`)).toBeTruthy();
            expect(VideoFrameViewModel.isFrameValid(`<iframe></iframe>`)).toBeTruthy();
            expect(VideoFrameViewModel.isFrameValid(`<iframe>SOME VALUE</iframe>`)).toBeTruthy();
            expect(VideoFrameViewModel.isFrameValid(`<iframe height=\'ss\'></iframe>`)).toBeTruthy();
        });
    });
});