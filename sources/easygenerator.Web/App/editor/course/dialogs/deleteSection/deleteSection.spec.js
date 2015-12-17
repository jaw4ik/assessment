import deleteSectionDeialog from './deleteSection';

//describe('unrelateSection:', () => {

//    let promise;

//    beforeEach(() => {
//        promise = Promise.resolve();
//        spyOn(unrelateSectionCommand, 'execute').and.returnValue(promise);
//    });

//    it('should unrelate section', done => (async () => {
//        let id = courseViewModel.sections()[0].id();
//        courseViewModel.unrelateSection(courseViewModel.sections()[0]);
//        await promise;
//        expect(courseViewModel.sections()[0].id()).not.toBe(id);
//    })().then(done));

//    it('should show saved message', done => (async () => {
//        courseViewModel.unrelateSection(courseViewModel.sections()[0]);
//        await promise;
//        expect(notify.saved).toHaveBeenCalled();
//    })().then(done));

//});