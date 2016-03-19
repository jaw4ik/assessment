import SectionCommentContext from 'review/comments/context/commentContexts/SectionCommentContext';

import constants from 'constants';
import localizationManager from 'localization/localizationManager';
import SectionCommentContextEntity from 'review/comments/context/contextEntities/SectionCommentContextEntity';

describe('review context [SectionCommentContext]', () => {
    beforeEach(() => {
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg + 'loc';
        });
    });

    describe('constructor:', () => {
        let contextData = { id: 'id', title: 'title' },
            courseId = 'courseId';


        it('should set properties', () => {
            let verbKey = 'commented',
                descriptionKey = 'onTheTitleOfTheSection';

            let context = new SectionCommentContext(courseId, contextData);
            expect(context.verb).toBe(verbKey + 'loc');
            expect(context.description).toBe(descriptionKey + 'loc');
            expect(context.entity).toEqual(new SectionCommentContextEntity(courseId, contextData.id, contextData.title));
        });
      
    });
});