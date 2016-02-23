import FilterCriteriaFactory from './xApiFilterCriteriaFactory';

import constants from 'constants';

describe('class [FilterCriteriaFactory]', () => {

    it('should be defined', () => {
        expect(FilterCriteriaFactory).toBeDefined();
    });

    describe('[create]', () => {

        it('should be method of FilterCriteriaFactory', () => {
            expect(FilterCriteriaFactory.create).toBeFunction();
        });

        describe('when spec is not an object', () => {
            it('should throw exception', () => {
                var f = () => {
                    FilterCriteriaFactory.create();
                };
                expect(f).toThrow();
            });
        });

        describe('when spec is passed', () => {
            it('should fill instance with v prop', () => {
                var criteria = FilterCriteriaFactory.create({});
                expect(criteria.v).toBeDefined();
            });
        });

        describe('when spec contains courseId', () => {
            it('should fill instance with courseId', () => {
                var spec = { courseId: "courseId" };
                var criteria = FilterCriteriaFactory.create(spec);
                expect(criteria[constants.reporting.filterKeys.courseId]).toBe(spec.courseId);
            });
        });

        describe('when spec contains learningPathId', () => {
            it('should fill instance with learningPathId', () => {
                var spec = { learningPathId: "learningPathId" };
                var criteria = FilterCriteriaFactory.create(spec);
                expect(criteria[constants.reporting.filterKeys.learningPathId]).toBe(spec.learningPathId);
            });
        });

        describe('when spec contains verbs', () => {
            describe('and verbs is string', () => {
                it('should fill instance with one verb', () => {
                    var spec = { verbs: "verbs" };
                    var criteria = FilterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.verb]).toBe(spec.verbs);
                });
            });

            describe('and verbs is array', () => {
                it('should fill instance with comma separated verbs', () => {
                    var spec = { verbs: ["verb1", "verb2"] };
                    var criteria = FilterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.verb]).toBe(spec.verbs.join(","));
                });
            });
        });

        describe('when spec contains learnerEmail', () => {
            describe('and learnerEmail contains mailto at the beginning', () => {
                it('should fill instance with Agent with proper mailtoIRI', () => {
                    var spec = { learnerEmail: "mailto:learnerEmail" };
                    var criteria = FilterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.agent]).toBeObject();
                    expect(criteria[constants.reporting.filterKeys.agent].objectType).toBe("Agent");
                    expect(criteria[constants.reporting.filterKeys.agent].mbox).toBe(spec.learnerEmail);
                });
            });

            describe('and learnerEmail does not contain mailto at the beginning', () => {
                it('should add mailto to email and fill instance with Agent with proper mailtoIRI', () => {
                    var spec = { learnerEmail: "learnerEmail" };
                    var criteria = FilterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.agent]).toBeObject();
                    expect(criteria[constants.reporting.filterKeys.agent].objectType).toBe("Agent");
                    expect(criteria[constants.reporting.filterKeys.agent].mbox).toBe(`mailto:${spec.learnerEmail}`);
                });
            });
        });

        describe('when spec contains limit', () => {
            it('should fill instance with limit', () => {
                var spec = { limit: 10 };
                var criteria = FilterCriteriaFactory.create(spec);
                expect(criteria[constants.reporting.filterKeys.limit]).toBe(spec.limit);
            });
        });

        describe('when spec contains limit', () => {
            it('should fill instance with limit', () => {
                var spec = { limit: 20 };
                var criteria = FilterCriteriaFactory.create(spec);
                expect(criteria[constants.reporting.filterKeys.limit]).toBe(spec.limit);
            });
        });

        describe('when spec contains skip', () => {
            it('should fill instance with skip', () => {
                var spec = { skip: 20 };
                var criteria = FilterCriteriaFactory.create(spec);
                expect(criteria[constants.reporting.filterKeys.skip]).toBe(spec.skip);
            });
        });

        describe('when spec contains attemptIds', () => {
            describe('and attemptIds is string', () => {
                it('should fill instance with one attemptId', () => {
                    var spec = { attemptIds: "attemptId" };
                    var criteria = FilterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.attemptId]).toBe(spec.attemptIds);
                });
            });

            describe('and attemptIds is array', () => {
                it('should fill instance with comma separated attemptIds', () => {
                    var spec = { attemptIds: ["attemptId1", "attemptId2"] };
                    var criteria = FilterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.attemptId]).toBe(spec.attemptIds.join(","));
                });
            });

        });

        describe('when spec contains parentId', () => {
            it('should fill instance with parentId', () => {
                var spec = { parentId: "parentId" };
                var criteria = FilterCriteriaFactory.create(spec);
                expect(criteria[constants.reporting.filterKeys.parentId]).toBe(spec.parentId);
            });
        });

        describe('when spec contains embeded', () => {
            it('should fill instance with embeded', () => {
                var spec = { embeded: true };
                var criteria = FilterCriteriaFactory.create(spec);
                expect(criteria[constants.reporting.filterKeys.embeded]).toBe(spec.embeded);
            });
        });

    });

});