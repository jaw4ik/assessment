﻿import viewModel from './courseTemplateStep';

import constants from 'constants';

describe('dialog course step [courseTemplateStep]', function () {

    beforeEach(function () {
        spyOn(viewModel, 'trigger');
    });

    describe('submit:', function () {
        it('should trigger stepSubmitted event', function () {
            viewModel.submit();
            expect(viewModel.trigger).toHaveBeenCalledWith(constants.dialogs.stepSubmitted);
        });
    });

    describe('templateSelector:', function () {
        it('should be defined', function () {
            expect(viewModel.templateSelector).toBeDefined();
        });
    });

    describe('getSelectedTemplateId:', function () {
        var templateId = 'templateId';
        beforeEach(function () {
            spyOn(viewModel.templateSelector, 'getSelectedTemplateId').and.returnValue(templateId);
        });

        it('should return templateSelector selected template id', function () {
            expect(viewModel.getSelectedTemplateId()).toBe(templateId);
        });
    });
});