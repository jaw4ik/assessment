import GeneralCommentContext from 'review/comments/context/commentContexts/GeneralCommentContext';

import localizationManager from 'localization/localizationManager';

describe('review context [GeneralCommentContext]', () => {
    beforeEach(() => {
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg + 'loc';
        });
    });

    describe('constructor:', () => {
        it('should set properties', () => {
            let verbKey = 'left',
                descriptionKey = 'generalComment';

            let context = new GeneralCommentContext(verbKey, descriptionKey);
            expect(context.verb).toBe(verbKey + 'loc');
            expect(context.description).toBe(descriptionKey + 'loc');
        });
    });
});