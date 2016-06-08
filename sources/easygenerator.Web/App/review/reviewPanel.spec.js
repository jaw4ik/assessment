import reviewPanel from 'review/reviewPanel';

import constants from 'constants';
import app from 'durandal/app';
import router from 'routing/router';
import courseComments from 'review/comments/courseComments';
import coursePublish from 'review/publish/coursePublish';
import eventTracker from 'eventTracker';

describe('[review panel]', () => {

    let courseId,
        routeData = {
            courseId: null
        };

    beforeEach(() => {
        courseId = 'courseId';
        spyOn(router, 'on');
        spyOn(router, 'off');
        spyOn(eventTracker, 'publish');
        spyOn(courseComments, 'initialize');
        spyOn(courseComments, 'tearDown');
        spyOn(coursePublish, 'initialize');
        spyOn(app, 'trigger');
    });

    describe('ctor:', () => {
        describe('isExpanded:', () => {
            it('should be observable', () => {
                expect(reviewPanel.isExpanded).toBeObservable();
            });

            it('should be false', () => {
                expect(reviewPanel.isExpanded()).toBeFalsy();
            });
        });

        describe('isVisible:', () => {
            it('should be computed', () => {
                expect(reviewPanel.isVisible).toBeComputed();
            });

            describe('when route data course id is undefined', () => {
                beforeEach(() => {
                    routeData.courseId = undefined;
                    router.routeData(routeData);
                });

                it('should be false', () => {
                    expect(reviewPanel.isVisible()).toBeFalsy();
                });
            });

            describe('when route data course id is a string', () => {
                beforeEach(() => {
                    routeData.courseId = 'courseId';
                    router.routeData(routeData);
                });

                it('should be true', () => {
                    expect(reviewPanel.isVisible()).toBeTruthy();
                });
            });
        });

        describe('routeCourseId:', () => {
            it('should be computed', () => {
                expect(reviewPanel.routeCourseId).toBeComputed();
            });

            it('should be false', () => {
                let val = 'courseIdValue';
                routeData.courseId = val;
                router.routeData(routeData);

                expect(reviewPanel.routeCourseId()).toBe(val);
            });
        });

        describe('courseId:', () => {
            it('should be null', () => {
                expect(reviewPanel.courseId).toBeNull();
            });
        });

        describe('courseComments:', () => {
            it('should be defined', () => {
                expect(reviewPanel.courseComments).toBe(courseComments);
            });
        });

        describe('coursePublish:', () => {
            it('should be defined', () => {
                expect(reviewPanel.coursePublish).toBe(coursePublish);
            });
        });
    });

    describe('expand:', () => {
        beforeEach(() => {
            routeData.courseId = courseId;
            router.routeData(routeData);
        });

        it('should set is expanded to true', () => {
            reviewPanel.isExpanded(false);
            reviewPanel.expand();
            expect(reviewPanel.isExpanded()).toBeTruthy();
        });

        it('should set courseId', () => {
            reviewPanel.courseId = null;
            reviewPanel.expand();
            expect(reviewPanel.courseId).toBe(courseId);
        });

        it('should initialize course comments', () => {
            reviewPanel.expand();
            expect(courseComments.initialize).toHaveBeenCalledWith(courseId);
        });

        it('should initialize course publish', () => {
            reviewPanel.expand();
            expect(coursePublish.initialize).toHaveBeenCalledWith(courseId);
        });

        it('should trigger app event side panel expanded', () => {
            reviewPanel.expand();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.sidePanel.expanded);
        });

        it('should publish \'Open review tab\' event', () => {
            reviewPanel.expand();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open review tab');
        });

        it('should subscribe on \'router:navigation:composition-complete\' router event', () => {
            reviewPanel.expand();
            expect(router.on).toHaveBeenCalledWith('router:navigation:composition-complete', reviewPanel._routerNavigatedProxy);
        });
    });

    describe('collapse:', () => {
        it('should set is expanded to false', () => {
            reviewPanel.isExpanded(true);
            reviewPanel.toggleIsExpanded();
            expect(reviewPanel.isExpanded()).toBeFalsy();
        });

        it('should set courseId to null', () => {
            reviewPanel.courseId = courseId;
            reviewPanel.collapse();
            expect(reviewPanel.courseId).toBeNull();
        });

        it('should tearDown course comments', () => {
            reviewPanel.collapse();
            expect(courseComments.tearDown).toHaveBeenCalled();
        });

        it('should trigger app event side panel collapsed', () => {
            reviewPanel.collapse();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.sidePanel.collapsed);
        });

        it('should unsubscribe from \'router:navigation:composition-complete\' router event', () => {
            reviewPanel.collapse();
            expect(router.off).toHaveBeenCalledWith('router:navigation:composition-complete', reviewPanel._routerNavigatedProxy);
        });
    });

    describe('routerNavigated:', () => {
        describe('when is visible', () => {
            beforeEach(() => {
                routeData.courseId = courseId;
                router.routeData(routeData);
            });

            describe('and when course id equals route course id', () => {
                beforeEach(() => {
                    reviewPanel.courseId = courseId;
                });

                it('should not set is expanded to false', () => {
                    reviewPanel.isExpanded(true);
                    reviewPanel.routerNavigated();
                    expect(reviewPanel.isExpanded()).toBeTruthy();
                });
            });
                            
            describe('and when course id is not equal to route course id', () => {
                beforeEach(() => {
                    reviewPanel.courseId = 'someId';
                });

                it('should set is expanded to false', () => {
                    reviewPanel.isExpanded(true);
                    reviewPanel.routerNavigated();
                    expect(reviewPanel.isExpanded()).toBeFalsy();
                });

                it('should set courseId to null', () => {
                    reviewPanel.routerNavigated();
                    expect(reviewPanel.courseId).toBeNull();
                });

                it('should tearDown course comments', () => {
                    reviewPanel.routerNavigated();
                    expect(courseComments.tearDown).toHaveBeenCalled();
                });

                it('should trigger app event side panel collapsed', () => {
                    reviewPanel.routerNavigated();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.sidePanel.collapsed);
                });

                it('should unsubscribe from \'router:navigation:composition-complete\' router event', () => {
                    reviewPanel.routerNavigated();
                    expect(router.off).toHaveBeenCalledWith('router:navigation:composition-complete', reviewPanel._routerNavigatedProxy);
                });
            });
        });

        describe('when is not visible', () => {
            beforeEach(() => {
                routeData.courseId = null;
                router.routeData(routeData);
            });
            
            it('should set is expanded to false', () => {
                reviewPanel.isExpanded(true);
                reviewPanel.routerNavigated();
                expect(reviewPanel.isExpanded()).toBeFalsy();
            });

            it('should set courseId to null', () => {
                reviewPanel.courseId = courseId;
                reviewPanel.routerNavigated();
                expect(reviewPanel.courseId).toBeNull();
            });

            it('should tearDown course comments', () => {
                reviewPanel.routerNavigated();
                expect(courseComments.tearDown).toHaveBeenCalled();
            });

            it('should trigger app event side panel collapsed', () => {
                reviewPanel.routerNavigated();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.sidePanel.collapsed);
            });

            it('should unsubscribe from \'router:navigation:composition-complete\' router event', () => {
                reviewPanel.routerNavigated();
                expect(router.off).toHaveBeenCalledWith('router:navigation:composition-complete', reviewPanel._routerNavigatedProxy);
            });
        });
    });

    describe('toggleIsExpanded:', () => {
        describe('when is expanded', () => {
            beforeEach(() => {
                reviewPanel.isExpanded(true);
            });

            it('should set is expanded to false', () => {
                reviewPanel.isExpanded(true);
                reviewPanel.toggleIsExpanded();
                expect(reviewPanel.isExpanded()).toBeFalsy();
            });

            it('should set courseId to null', () => {
                reviewPanel.courseId = courseId;
                reviewPanel.collapse();
                expect(reviewPanel.courseId).toBeNull();
            });

            it('should tearDown course comments', () => {
                reviewPanel.collapse();
                expect(courseComments.tearDown).toHaveBeenCalled();
            });

            it('should trigger app event side panel collapsed', () => {
                reviewPanel.collapse();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.sidePanel.collapsed);
            });

            it('should unsubscribe from \'router:navigation:composition-complete\' router event', () => {
                reviewPanel.collapse();
                expect(router.off).toHaveBeenCalledWith('router:navigation:composition-complete', reviewPanel._routerNavigatedProxy);
            });
        });

        describe('when is not expanded', () => {
            beforeEach(() => {
                reviewPanel.isExpanded(false);
                routeData.courseId = courseId;
                router.routeData(routeData);
            });

            it('should set is expanded to true', () => {
                reviewPanel.isExpanded(false);
                reviewPanel.expand();
                expect(reviewPanel.isExpanded()).toBeTruthy();
            });

            it('should set courseId', () => {
                reviewPanel.courseId = null;
                reviewPanel.expand();
                expect(reviewPanel.courseId).toBe(courseId);
            });

            it('should initialize course comments', () => {
                reviewPanel.expand();
                expect(courseComments.initialize).toHaveBeenCalledWith(courseId);
            });

            it('should initialize course publish', () => {
                reviewPanel.expand();
                expect(coursePublish.initialize).toHaveBeenCalledWith(courseId);
            });

            it('should trigger app event side panel expanded', () => {
                reviewPanel.expand();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.sidePanel.expanded);
            });

            it('should publish \'Open review tab\' event', () => {
                reviewPanel.expand();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open review tab');
            });

            it('should subscribe on \'router:navigation:composition-complete\' router event', () => {
                reviewPanel.expand();
                expect(router.on).toHaveBeenCalledWith('router:navigation:composition-complete', reviewPanel._routerNavigatedProxy);
            });

        });
    });
    
});