import ObjectiveCommentContext from 'review/comments/context/commentContexts/ObjectiveCommentContext';

import constants from 'constants';
import localizationManager from 'localization/localizationManager';
import ObjectiveCommentContextEntity from 'review/comments/context/contextEntities/ObjectiveCommentContextEntity';

describe('review context [ObjectiveCommentContext]', () => {
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

            let context = new ObjectiveCommentContext(courseId, contextData);
            expect(context.verb).toBe(verbKey + 'loc');
            expect(context.description).toBe(descriptionKey + 'loc');
            expect(context.entity).toEqual(new ObjectiveCommentContextEntity(courseId, contextData.id, contextData.title));
        });
      
    });
});