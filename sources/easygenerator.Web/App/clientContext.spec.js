define(['clientContext'], function (clientContext) {
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
                    spyOn(localStorage, 'getItem').andReturn(JSON.stringify('my_value'));
                    expect(clientContext.get('my_key')).toBe('my_value');
                });

                it('should convert string value to object', function () {
                    spyOn(JSON, 'parse');
                    spyOn(localStorage, 'getItem').andReturn(JSON.stringify({ field: 'value' }));

                    clientContext.get('key');
                    expect(JSON.parse).toHaveBeenCalledWith("{\"field\":\"value\"}");
                });

                it('should return the same object that has been set', function () {
                    var object = { field1: 'value1', field2: { field3: 'value3' } };
                    spyOn(localStorage, 'getItem').andReturn(JSON.stringify(object));

                    expect(clientContext.get('key')).toEqual(object);
                });

            });

        });

        describe('remove:', function() {

            it('should be function', function() {
                expect(clientContext.remove).toBeFunction();
            });

            describe('when key is null', function() {

                it('should throw expection', function () {
                    var f = function () { clientContext.remove(null); };
                    expect(f).toThrow();
                });

            });

            describe('when key is undefined', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.remove(); };
                    expect(f).toThrow();
                });

            });
            

            describe('when key is empty', function () {

                it('should throw expection', function () {
                    var f = function () { clientContext.remove(''); };
                    expect(f).toThrow();
                });

            });


            describe('when key is string', function () {

                it('should remove item from local storage', function () {
                    spyOn(localStorage, 'removeItem');

                    var key = 'SomeKey';

                    clientContext.remove(key);

                    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
                });

            });
            
        });
    });

});