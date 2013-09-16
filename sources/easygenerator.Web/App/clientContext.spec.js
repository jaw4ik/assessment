﻿define(['clientContext'], function (clientContext) {
    "use strict";

    describe('[clientContext]', function () {

        describe('set:', function () {

            it('should be function', function () {
                expect(clientContext.set).toBeFunction();
            });

            describe('when argument \'key\' is undefined', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.set(); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is null', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.set(null); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is empty', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.set(''); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'value\' is undefined', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.set('key'); };
                    expect(f).toThrow();
                });

            });

            describe('when valid arguments', function () {

                it('should convert input value to string', function () {
                    spyOn(JSON, 'stringify');
                    clientContext.set('key', { field: 'value' });
                    expect(JSON.stringify).toHaveBeenCalledWith({ field: 'value' });
                });

            });

        });

        describe('get:', function () {

            it('should be function', function () {
                expect(clientContext.get).toBeFunction();
            });

            describe('when argument \'key\' is undefined', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.get(); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is null', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.get(null); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is empty', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.get(''); };
                    expect(f).toThrow();
                });

            });

            describe('when valid argument', function () {

                it('should return value', function () {
                    localStorage.setItem('my_key', JSON.stringify('my_value'));
                    expect(clientContext.get('my_key')).toBe('my_value');
                });

                it('should convert string value to object', function () {
                    spyOn(JSON, 'parse');
                    localStorage.setItem('key', JSON.stringify({ field: 'value' }));
                    
                    clientContext.get('key');
                    expect(JSON.parse).toHaveBeenCalledWith("{\"field\":\"value\"}");
                });

                it('should return the same object that has been set', function () {
                    var object = { field1: 'value1', field2: { field3: 'value3' } };
                    localStorage.setItem('key', JSON.stringify(object));

                    expect(clientContext.get('key')).toEqual(object);
                });

            });

        });

    });

});