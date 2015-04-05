﻿define(['models/reporting/actor'], function (Actor) {
    "use strict";

    describe('model [Actor]', function () {

        it('should be constructor function', function () {
            expect(Actor).toBeFunction();
        });

        describe('when specification is not an object', function () {

            it('should throw exception', function () {
                var f = function () {
                    new Actor();
                };
                expect(f).toThrow();
            });

        });

        describe('constructor:', function () {

            it('should fill model with correct initial data', function () {
                var spec = {
                    name: "Name",
                    mbox: "mailto:aa@aa.aa"
                };

                var actor = new Actor(spec);

                expect(actor.name).toEqual(spec.name);
                expect(actor.email).toEqual(spec.mbox.replace('mailto:', ''));
            });
        });
    });
});