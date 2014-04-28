define(['widgets/notifyViewer/viewmodel'], function (viewModel) {

    "use strict";

    describe('viewmodel [notifyViewer]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('prototype:', function () {

            describe('activate:', function () {

                it('should be function', function () {
                    expect(viewModel.prototype.activate).toBeFunction();
                });

                it('should set enabled', function () {
                    viewModel.prototype.activate();
                    expect(viewModel.prototype.enabled).toBeDefined();
                });

                it('should set notifications', function () {
                    viewModel.prototype.activate();
                    expect(viewModel.prototype.notifications).toBeDefined();
                });

            });

            describe('closeNotice:', function () {

                it('should be function', function () {
                    expect(viewModel.prototype.closeNotice).toBeFunction();
                });

                it('should remove notice from array', function () {
                    var notice = { text: 'notice1' };
                    spyOn(viewModel.prototype.notifications, 'remove');
                    viewModel.prototype.closeNotice(notice);
                    expect(viewModel.prototype.notifications.remove).toHaveBeenCalledWith(notice);
                });

            });

            describe('addNotice:', function () {

                it('should be function', function () {
                    expect(viewModel.prototype.addNotice).toBeFunction();
                });

                beforeEach(function () {
                    spyOn($.fn, 'hide').and.returnValue($.fn);
                    spyOn($.fn, 'fadeIn');
                });

                describe('when node type is not 1', function () {

                    it('should not show notice', function () {
                        viewModel.prototype.addNotice({ nodeType: 0 });
                        expect($.fn.hide).not.toHaveBeenCalled();
                        expect($.fn.fadeIn).not.toHaveBeenCalled();
                    });

                });

                describe('when node type is 1', function () {

                    it('should hide notice', function () {
                        viewModel.prototype.addNotice({ nodeType: 1 });
                        expect($.fn.hide).toHaveBeenCalled();
                    });

                    it('should add show notice animation to queue', function () {
                        spyOn(viewModel.queue, 'push');
                        var notice = { nodeType: 1 };
                        viewModel.prototype.addNotice(notice);
                        expect(viewModel.queue.push).toHaveBeenCalledWith(viewModel.showItem, notice);
                    });

                });

            });
        });

        describe('showItem:', function () {
            var timerCallback;

            beforeEach(function () {
                timerCallback = jasmine.createSpy("timerCallback");
                jasmine.clock().install();
            });

            afterEach(function () {
                jasmine.clock().uninstall();
            });

            it('should be function', function () {
                expect(viewModel.showItem).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.showItem()).toBePromise();
            });

            it('should fade in item', function () {
                spyOn($.fn, 'fadeIn');
                viewModel.showItem();
                expect($.fn.fadeIn).toHaveBeenCalled();
            });

            it('should fade out in 7 seconds', function() {
                spyOn($.fn, 'fadeOut');
                viewModel.showItem();

                jasmine.clock().tick(8000);

                expect($.fn.fadeOut).toHaveBeenCalled();
            });
        });

        describe('queue:', function () {

            it('should be defined', function () {
                expect(viewModel.queue).toBeDefined();
            });

            it('should call pushed function', function (done) {
                var obj = { func: function () { } };
                spyOn(obj, 'func');
                viewModel.queue.promise = Q();

                viewModel.queue.push(obj.func).fin(function () {
                    expect(obj.func).toHaveBeenCalled();
                    done();
                });
            });

        });

    });

});