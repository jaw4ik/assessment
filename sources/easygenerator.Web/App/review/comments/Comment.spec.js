import Comment from 'review/comments/Comment';
import commentContextFactory from 'review/comments/context/commentContextFactory';

describe('review [Comment]', () => {
    let commentData = {
            id: 'id',
            text: 'text',
            email: 'email',
            name: 'name',
            createdOn: new Date(),
            context: {}
        },
        comment,
        context = {
            verb: 'commented'
        },
        courseId = 'courseId';

    beforeEach(() => {
        spyOn(commentContextFactory, 'createContext').and.returnValue(context);
        comment = new Comment(courseId, commentData);
    });

    describe('ctor:', () => {

        describe('id:', () => {
            it('should be set', () => {
                expect(comment.id).toBe(commentData.id);
            });
        });

        describe('text:', () => {
            it('should be set', () => {
                expect(comment.text).toBe(commentData.text);
            });
        });

        describe('originalContext:', () => {
            it('should be set', () => {
                expect(comment.originalContext).toBe(commentData.context);
            });
        });

        describe('context:', () => {
            it('should create comment context', () => {
                expect(commentContextFactory.createContext).toHaveBeenCalledWith(courseId, commentData.context);
            });

            it('should be set', () => {
                expect(comment.context).toBe(context);
            });
        });

        describe('email:', () => {
            it('should be set', () => {
                expect(comment.email).toBe(commentData.email);
            });
        });

        describe('name:', () => {
            it('should be set', () => {
                expect(comment.name).toBe(commentData.name);
            });
        });

        describe('avatarLetter:', () => {
            it('should be set', () => {
                expect(comment.avatarLetter).toBe(commentData.name.charAt(0));
            });
        });

        describe('createdOn:', () => {
            it('should be set', () => {
                expect(comment.createdOn).toBe(commentData.createdOn);
            });
        });

        describe('isDeleted:', () => {
            it('should be observable', () => {
                expect(comment.isDeleted).toBeObservable();
            });

            it('should be false', () => {
                expect(comment.isDeleted()).toBeFalsy();
            });
        });

        describe('isExpanded:', () => {
            it('should be observable', () => {
                expect(comment.isExpanded).toBeObservable();
            });

            it('should be false', () => {
                expect(comment.isExpanded()).toBeFalsy();
            });
        });

        describe('isExpandable:', () => {
            it('should be observable', () => {
                expect(comment.isExpandable).toBeObservable();
            });

            it('should be false', () => {
                expect(comment.isExpandable()).toBeFalsy();
            });
        });
    });

    describe('toggleIsExpanded:', () => {
        describe('when is expanded', () => {
            beforeEach(() => {
                comment.isExpanded(true);
            });

            it('should set isExoanded to false', () => {
                comment.toggleIsExpanded();
                expect(comment.isExpanded()).toBeFalsy();
            });
        });

        describe('when not is expanded', () => {
            beforeEach(() => {
                comment.isExpanded(false);
            });

            it('should set isExoanded to true', () => {
                comment.toggleIsExpanded();
                expect(comment.isExpanded()).toBeTruthy();
            });
        });
    });
});