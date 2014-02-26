define(['viewmodels/courses/courseNavigation/navigation'],
    function (navigation) {

        describe('viewmodel [courseNavigation]', function () {

            describe('items:', function() {
                it('should be array', function() {
                    expect(navigation.items).toBeArray();
                });
            });

            describe('activate:', function() {
                it('should be function', function() {
                    expect(navigation.activate).toBeFunction();
                });

                it('should fill items collection', function() {
                    navigation.activate();
                    expect(navigation.items.length).toBe(3);
                });
            });
        });
    });