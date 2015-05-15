define(['reporting/xApiFilterCriteriaFactory'], function (filterCriteriaFactory) {
    "use strict";

    var constants = require('constants');

    describe('model [filterCriteriaFactory]', function () {

        it('should be an object', function () {
            expect(filterCriteriaFactory).toBeObject();
        });

        describe('[create]', function () {

            it('should be function', function () {
                expect(filterCriteriaFactory.create).toBeFunction();
            });

            describe('when spec is not an object', function () {
                it('should throw exception', function () {
                    var f = function () {
                        filterCriteriaFactory.create();
                    };
                    expect(f).toThrow();
                });
            });

            describe('when spec is passed', function () {
                it('should fill instance with v prop', function () {
                    var criteria = filterCriteriaFactory.create({});
                    expect(criteria.v).toBeDefined();
                });
            });

            describe('when spec contains courseId', function () {
                it('should fill instance with courseId', function () {
                    var spec = { courseId: "courseId" };
                    var criteria = filterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.courseId]).toBe(spec.courseId);
                });
            });

            describe('when spec contains verbs', function () {
                describe('and verbs is string', function () {
                    it('should fill instance with one verb', function () {
                        var spec = { verbs: "verbs" };
                        var criteria = filterCriteriaFactory.create(spec);
                        expect(criteria[constants.reporting.filterKeys.verb]).toBe(spec.verbs);
                    });
                });

                describe('and verbs is array', function () {
                    it('should fill instance with comma separated verbs', function () {
                        var spec = { verbs: ["verb1", "verb2"] };
                        var criteria = filterCriteriaFactory.create(spec);
                        expect(criteria[constants.reporting.filterKeys.verb]).toBe(spec.verbs.join(","));
                    });
                });
            });

            describe('when spec contains learnerEmail', function () {
                describe('and learnerEmail contains mailto at the beginning', function () {
                    it('should fill instance with Agent with proper mailtoIRI', function () {
                        var spec = { learnerEmail: "mailto:learnerEmail" };
                        var criteria = filterCriteriaFactory.create(spec);
                        expect(criteria[constants.reporting.filterKeys.agent]).toBeObject();
                        expect(criteria[constants.reporting.filterKeys.agent].objectType).toBe("Agent");
                        expect(criteria[constants.reporting.filterKeys.agent].mbox).toBe(spec.learnerEmail);
                    });
                });

                describe('and learnerEmail does not contain mailto at the beginning', function () {
                    it('should add mailto to email and fill instance with Agent with proper mailtoIRI', function () {
                        var spec = { learnerEmail: "learnerEmail" };
                        var criteria = filterCriteriaFactory.create(spec);
                        expect(criteria[constants.reporting.filterKeys.agent]).toBeObject();
                        expect(criteria[constants.reporting.filterKeys.agent].objectType).toBe("Agent");
                        expect(criteria[constants.reporting.filterKeys.agent].mbox).toBe('mailto:' + spec.learnerEmail);
                    });
                });
            });

            describe('when spec contains limit', function () {
                it('should fill instance with limit', function () {
                    var spec = { limit: 10 };
                    var criteria = filterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.limit]).toBe(spec.limit);
                });
            });

            describe('when spec contains limit', function () {
                it('should fill instance with limit', function () {
                    var spec = { limit: 20 };
                    var criteria = filterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.limit]).toBe(spec.limit);
                });
            });

            describe('when spec contains skip', function () {
                it('should fill instance with skip', function () {
                    var spec = { skip: 20 };
                    var criteria = filterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.skip]).toBe(spec.skip);
                });
            });

            describe('when spec contains attemptId', function () {
                it('should fill instance with attemptId', function () {
                    var spec = { attemptId: "attemptId" };
                    var criteria = filterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.attemptId]).toBe(spec.attemptId);
                });
            });

            describe('when spec contains parentId', function () {
                it('should fill instance with parentId', function () {
                    var spec = { parentId: "parentId" };
                    var criteria = filterCriteriaFactory.create(spec);
                    expect(criteria[constants.reporting.filterKeys.parentId]).toBe(spec.parentId);
                });
            });
        });

    });
});