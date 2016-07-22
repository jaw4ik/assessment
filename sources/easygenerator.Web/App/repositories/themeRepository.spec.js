import repository from './themeRepository.js';

import apiHttpWrapper from 'http/apiHttpWrapper';
import themeModelMapper from 'mappers/themeModelMapper';
import app from 'durandal/app';
import constants from 'constants';

let templateId = 'templateId';
let theme = {
    id: 'themeId',
    name: 'themeName',
    settings: {}
};


describe('repository [themeRepository]', () => {

    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('getCollection', () => {
        describe('when template id is not a string', () => {
            it('should throw error', () => {
                let f = () => { repository.getCollection(); };
                expect(f).toThrow('Template id is not a string');
            });
        });

        it('should post get themes request', () => {
            spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.reject());
            repository.getCollection(templateId);
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/template/themes', { templateId: templateId });
        });

        describe('when request is failed', () => {
            it('should reject promise', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.reject('reason'));
                repository.getCollection(templateId)
                    .catch(reason => {
                        expect(reason).toBe('reason');
                        done();
                    });
            });
        });

        describe('when request is successfull', () => {
            describe('and response is not an array', () => {
                it('should reject promise', done => {
                    spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve());
                    repository.getCollection(templateId)
                        .catch(reason => {
                            expect(reason).toBe('Response is not an array');
                            done();
                        });
                });
            });

            it('should resolve promise with themes', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve([{}, {}]));
                spyOn(themeModelMapper, 'map').and.returnValue(theme);
                repository.getCollection(templateId)
                    .then(themes => {
                        expect(themes).toBeArray();
                        expect(themes.length).toBe(2);
                        done();
                    });
            });
        });
    });

    describe('add:', () => {
        describe('when template id is not a string', () => {
            it('should throw exception', () => {
                let f = () => { repository.add(); };
                expect(f).toThrow('Template id is not a string');
            });
        });

        describe('when name is not a string', () => {
            it('should throw exception', () => {
                let f = () => { repository.add(templateId); };
                expect(f).toThrow('Name is not a string');
            });
        });

        describe('when settings is not an object', () => {
            it('should throw exception', () => {
                let f = () => { repository.add(templateId, theme.name); };
                expect(f).toThrow('Settings is not an object');
            });
        });

        it('should post add theme request', () => {
            spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.reject());
            repository.add(templateId, theme.name, theme.settings);
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/template/theme/add', { templateId: templateId, name: theme.name, settings: JSON.stringify(theme.settings) });
        });

        describe('when theme adding failed', () => {
            it('should reject promise', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.reject('reason'));

                repository.add(templateId, theme.name, theme.settings).catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                });
                
            });
        });

        describe('when theme added successfully', () => {
            describe('and response is not an object', () => {
                it('should reject promise', done => {
                    spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve());
                    repository.add(templateId, theme.name, theme.settings)
                        .catch(reason => {
                            expect(reason).toBe('Response is not an object');
                            done();
                        });
                    
                });
            });

            it('should trigger theme added event', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve({}));
                spyOn(themeModelMapper, 'map').and.returnValue(theme);

                repository.add(templateId, theme.name, theme.settings)
                    .then(() => {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.themes.added, theme);
                        done();
                    });
            });

            it('should resolver promise with added theme', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve({}));
                spyOn(themeModelMapper, 'map').and.returnValue(theme);

                repository.add(templateId, theme.name, theme.settings)
                    .then(result => {
                        expect(result).toBe(theme);
                        done();
                    });
            });
        });
    });

    describe('update:', () => {
        describe('when theme id is not a string', () => {
            it('should throw exception', () => {
                let f = () => { repository.update(); };
                expect(f).toThrow('Theme id is not a string');
            });
        });

        describe('when settings is not an object', () => {
            it('should throw exception', () => {
                let f = () => { repository.update(theme.id); };
                expect(f).toThrow('Settings is not an object');
            });
        });

        it('should post update them e request', () => {
            spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.reject());
            repository.update(theme.id, theme.settings);
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/template/theme/update', { themeId: theme.id, settings: JSON.stringify(theme.settings) });
        });

        describe('when theme updating failed', () => {
            it('should reject promise', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.reject('reason'));

                repository.update(theme.id, theme.settings)
                    .catch(reason => {
                        expect(reason).toBeDefined();
                        done();
                    });
            });
        });

        describe('when theme updated successfully', () => {
            it('should trigger theme updated event', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve());

                repository.update(theme.id, theme.settings)
                    .then(() => {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.themes.updated, { themeId: theme.id, settings: theme.settings });
                        done();
                    });
            });
        });
    });

    describe('remove:', () => {
        describe('when theme id is not a string', () => {
            it('should throw exception', () => {
                let f = () => { repository.remove(); };
                expect(f).toThrow('Theme id is not a string');
            });
        });

        it('should post delete theme request', () => {
            spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.reject());
            repository.remove(theme.id);
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/template/theme/delete', { themeId: theme.id });
        });

        describe('when theme deleting failed', () => {
            it('should reject promise', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.reject('reason'));

                repository.remove(theme.id)
                    .catch(reason => {
                        expect(reason).toBeDefined();
                        done();
                    });
            });
        });

        describe('when theme deleted successfully', () => {
            it('should trigger theme deleted event', done => {
                spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve());

                repository.remove(theme.id)
                    .then(() => {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.themes.deleted, theme.id);
                        done();
                    });
            });
        });
    });
});