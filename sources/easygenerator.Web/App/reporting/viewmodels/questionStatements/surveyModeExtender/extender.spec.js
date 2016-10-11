import extender from './extender';
import constants from 'constants';
import multipleSelect from './supportedTypes/multipleSelect';
import singleSelectText from './supportedTypes/singleSelectText';
import statement from './supportedTypes/statement';

describe('[surveyModeExtender]', () => {

    let statement = null;

    describe('when question type is singleSelect', () => {

        beforeEach(() => {
            statement = {
                questionType: constants.questionType.singleSelectText.type,
                lrsStatement: {
                    response: '1',
                    definition: {
                        choices: [ {
                            id: '1',
                            description: {
                                'en-US': 'title1'
                            }
                        }, {
                            id: '2',
                            description: {
                                'en-US': 'title2'
                            }
                        }]
                    }
                }
            };
        });

        it('should extend object as Single Select', () => {
            extender.call(statement);
            expect(statement.answers).toBeArray();
        });

    });

    describe('when question type is multipleSelect', () => {

        beforeEach(() => {
            statement = {
                questionType: constants.questionType.multipleSelect.type,
                lrsStatement: {
                    response: '1[,]2',
                    definition: {
                        choices: [ {
                            id: '1',
                            description: {
                                'en-US': 'title1'
                            }
                        }, {
                            id: '2',
                            description: {
                                'en-US': 'title2'
                            }
                        }, {
                            id: '3',
                            description: {
                                'en-US': 'title3'
                            }
                        }]
                    }
                }
            };
        });

        it('should extend object as Single Select', () => {
            extender.call(statement);
            expect(statement.answers).toBeArray();
        });

    });

    describe('when question type is multipleSelect', () => {

        beforeEach(() => {
            statement = {
                questionType: constants.questionType.statement.type,
                lrsStatement: {
                    response: '1[.]true[,]2[.]false',
                    definition: {
                        choices: [ {
                            id: '1',
                            description: {
                                'en-US': 'title1'
                            }
                        }, {
                            id: '2',
                            description: {
                                'en-US': 'title2'
                            }
                        }, {
                            id: '3',
                            description: {
                                'en-US': 'title3'
                            }
                        }]
                    }
                }
            };
        });

        it('should extend object as Single Select', () => {
            extender.call(statement);
            expect(statement.answers).toBeArray();
        });

    });

});