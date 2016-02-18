import Polygon from './polygon';

import updatePolygonCommand from './commands/updatePolygon';
import notify from 'notify';
import eventTracker from 'eventTracker';

describe('polygon:', function () {

    it('should be constructor function', function () {
        expect(Polygon).toBeFunction();
        expect(new Polygon()).toBeObject();
    });

    describe('when polygon instance created', function () {
        var polygon,
            id = 'id',
            points = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 1 }];

        beforeEach(function () {
            polygon = new Polygon(id, points);
        });

        describe('id:', function () {

            it('should be equal to id param', function () {
                expect(polygon.id).toEqual(id);
            });

        });

        describe('isDeleted:', function () {

            it('should be falsy', function () {
                expect(polygon.isDeleted).toBeFalsy();
            });

        });

        describe('points:', function () {

            it('should be observable', function () {
                expect(polygon.points).toBeObservable();
            });

            it('should be equal to points param', function () {
                expect(polygon.points()).toBe(points);
            });

        });

        describe('isEditing:', function () {

            it('should be observable', function () {
                expect(polygon.isEditing).toBeObservable();
            });

            it('should be falsy', function () {
                expect(polygon.isEditing()).toBeFalsy();
            });

        });

        describe('startEditing:', function () {

            it('should be function', function () {
                expect(polygon.startEditing).toBeFunction();
            });

            it('should set isEditing to true', function () {
                polygon.isEditing(false);
                polygon.startEditing();
                expect(polygon.isEditing()).toBeTruthy();
            });

        });

        describe('endEditing:', function () {

            var updatePolygonDeferred,
                newPoints = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

            beforeEach(function () {
                updatePolygonDeferred = Q.defer();
                spyOn(updatePolygonCommand, 'execute').and.returnValue(updatePolygonDeferred.promise);
                spyOn(notify, 'saved');
                spyOn(eventTracker, 'publish');
            });

            it('should be function', function () {
                expect(polygon.endEditing).toBeFunction();
            });

            it('should set isEditing to false', function () {
                polygon.isEditing(true);
                polygon.endEditing(newPoints);
                expect(polygon.isEditing()).toBeFalsy();
            });

            it('should execute command to update polygon', function () {
                polygon.endEditing(newPoints);
                expect(updatePolygonCommand.execute).toHaveBeenCalledWith(id, newPoints);
            });

            describe('when update polygon command executed', function () {

                beforeEach(function () {
                    updatePolygonDeferred.resolve();
                });

                it('should update polygon points', function (done) {
                    polygon.points(points);
                    polygon.endEditing(newPoints);

                    updatePolygonDeferred.promise.then(function () {
                        expect(polygon.points()).toBe(newPoints);
                        done();
                    });
                });

                it('should notify user that everything was saved', function (done) {
                    polygon.endEditing(newPoints);

                    updatePolygonDeferred.promise.then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

                it('should track event \'Edit hotspot rectangle\'', function (done) {
                    polygon.endEditing(newPoints);

                    updatePolygonDeferred.promise.then(function () {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Edit hotspot rectangle');
                        done();
                    });
                });

            });
        });
    });

});
