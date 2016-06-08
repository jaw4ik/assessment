import QuestionTreeNode from './QuestionTreeNode';

import eventTracker from 'eventTracker';
import router from 'routing/router';

describe('[QuestionTreeNode]', function () {

    describe('create:', function () {

        it('should be function', function () {
            expect(QuestionTreeNode).toBeFunction();
        });

        it('should create questionTreeNode', function () {
            var questionTreeNode = new QuestionTreeNode('id', 'title', 'url');
            expect(questionTreeNode).toBeObject();
            expect(questionTreeNode.id).toEqual('id');
            expect(questionTreeNode.title).toBeObservable();
            expect(questionTreeNode.title()).toEqual('title');
            expect(questionTreeNode.url).toEqual('url');
            expect(questionTreeNode.navigateToQuestion).toBeFunction();
        });

    });

    describe('navigateToQuestion:', function() {

        var questionTreeNode;

        beforeEach(function() {
            questionTreeNode = new QuestionTreeNode('id', 'title', 'url');
        });

        it('should be function', function() {
            expect(questionTreeNode.navigateToQuestion).toBeFunction();
        });

        it('should send event \'Navigate to question editor\'', function () {
            spyOn(eventTracker, 'publish');
            questionTreeNode.navigateToQuestion();
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to question editor', 'Tree of content');
        });

        it('should navigate to question editor', function () {
            spyOn(router, 'navigate');
            questionTreeNode.navigateToQuestion();
            expect(router.navigate).toHaveBeenCalledWith(questionTreeNode.url);
        });

    });

});
