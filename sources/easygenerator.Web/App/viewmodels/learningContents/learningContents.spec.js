﻿import ViewModel from './learningContents';

describe('viewModel [learningContents]', () => {
    
    let viewModel;
    beforeEach(() => {
        viewModel = new ViewModel();
    });

    describe('activate:', () => {

        it('should set questionId', () => {
            let questionId = 'questionId';
            viewModel.questionId = null;
            viewModel.activate(questionId);
            expect(viewModel.questionId).toBe(questionId);
        });

    });

    describe('toggleExpand:', () => {

        it('should toggle isExpanded value', () => {
            viewModel.isExpanded(false);
            viewModel.toggleExpand();
            expect(viewModel.isExpanded()).toBeTruthy();
        });

    });

});
