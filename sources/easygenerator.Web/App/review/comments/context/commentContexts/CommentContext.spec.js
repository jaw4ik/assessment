import CommentContext from 'review/comments/context/commentContexts/CommentContext';

import localizationManager from 'localization/localizationManager';

describe('review context [CommentContext]', () => {
    beforeEach(() => {
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg + 'loc';
        });
    });

    describe('constructor:', () => {
        it('should set properties', () => {
            let verbKey = 'verbKey',
                descriptionKey = 'descriptionKey';

            let context = new CommentContext(verbKey, descriptionKey);
            expect(context.verb).toBe(verbKey + 'loc');
            expect(context.description).toBe(descriptionKey + 'loc');
        });
    });
});