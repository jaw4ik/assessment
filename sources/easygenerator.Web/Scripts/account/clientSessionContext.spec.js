define([], function () {
    "use strict";

    var clientSessionContext = app.clientSessionContext;

    describe('[clientSessionContext]', function () {

        describe('set:', function () {

            beforeEach(function() {
                spyOn(sessionStorage, 'setItem');
            });

            it('should be function', function () {
                expect(clientSessionContext.set).toBeFunction();
            });

            describe('when argument \'key\' is undefined', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.set(); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is null', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.set(null); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is empty', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.set(''); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'value\' is undefined', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.set('key'); };
                    expect(f).toThrow();
                });

            });

            describe('when valid arguments', function () {

                it('should convert input value to string', function () {
                    spyOn(JSON, 'stringify');
                    clientSessionContext.set('key', { field: 'value' });
                    expect(JSON.stringify).toHaveBeenCalledWith({ field: 'value' });
                });

            });

        });

        describe('get:', function () {

            it('should be function', function () {
                expect(clientSessionContext.get).toBeFunction();
            });

            describe('when argument \'key\' is undefined', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.get(); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is null', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.get(null); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is empty', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.get(''); };
                    expect(f).toThrow();
                });

            });

            describe('when valid argument', function () {

                it('should return value', function () {
                    spyOn(sessionStorage, 'getItem').andReturn(JSON.stringify('value'));
                    expect(clientSessionContext.get('key')).toBe('value');
                });

                it('should convert string value to object', function () {
                    var obj = { field: 'value' };
                    spyOn(sessionStorage, 'getItem').andReturn(JSON.stringify(obj));
                    spyOn(JSON, 'parse');

                    clientSessionContext.get('key');
                    expect(JSON.parse).toHaveBeenCalledWith("{\"field\":\"value\"}");
                });

                it('should return the same object that has been set', function () {
                    var object = { field1: 'value1', field2: { field3: 'value3' } };
                    spyOn(sessionStorage, 'getItem').andReturn(JSON.stringify(object));

                    expect(clientSessionContext.get('key')).toEqual(object);
                });

            });

        });
        
        describe('remove:', function () {

            it('should be function', function () {
                expect(clientSessionContext.remove).toBeFunction();
            });

            describe('when argument \'key\' is undefined', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.remove(); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is null', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.remove(null); };
                    expect(f).toThrow();
                });

            });

            describe('when argument \'key\' is empty', function () {

                it('should throw expection', function () {
                    var f = function () { clientSessionContext.remove(''); };
                    expect(f).toThrow();
                });

            });

            describe('when argument is valid', function () {

                beforeEach(function() {
                    spyOn(sessionStorage, 'removeItem');
                });

                it('should call session storage remove', function () {
                    clientSessionContext.remove('key');
                    expect(sessionStorage.removeItem).toHaveBeenCalledWith('key');
                });

            });

        });

    });

});