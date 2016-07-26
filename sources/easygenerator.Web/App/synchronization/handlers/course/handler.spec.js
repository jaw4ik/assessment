import handler from './handler';

describe('synchronization course [handler]', function () {

    describe('titleUpdated:', function () {
        it('should be function', function () {
            expect(handler.titleUpdated).toBeFunction();
        });
    });

    describe('introductionContentUpdated:', function () {
        it('should be function', function () {
            expect(handler.introductionContentUpdated).toBeFunction();
        });
    });

    describe('templateUpdated:', function () {
        it('should be function', function () {
            expect(handler.templateUpdated).toBeFunction();
        });
    });

    describe('sectionsReordered:', function () {
        it('should be function', function () {
            expect(handler.sectionsReordered).toBeFunction();
        });
    });

    describe('published:', function () {
        it('should be function', function () {
            expect(handler.published).toBeFunction();
        });
    });

    describe('publishedForSale:', function () {
        it('should be function', function () {
            expect(handler.publishedForSale).toBeFunction();
        });
    });

    describe('processedByCoggno:', function () {
        it('should be function', function () {
            expect(handler.processedByCoggno).toBeFunction();
        });
    });

    describe('deleted:', function () {
        it('should be function', function () {
            expect(handler.deleted).toBeFunction();
        });
    });

    describe('sectionRelated:', function () {
        it('should be function', function () {
            expect(handler.sectionRelated).toBeFunction();
        });
    });

    describe('sectionsUnrelated:', function () {
        it('should be function', function () {
            expect(handler.sectionsUnrelated).toBeFunction();
        });
    });

    describe('sectionsReplaced:', function () {
        it('should be function', function () {
            expect(handler.sectionsReplaced).toBeFunction();
        });
    });

    describe('stateChanged:', function () {
        it('should be function', function () {
            expect(handler.stateChanged).toBeFunction();
        });
    });

});
