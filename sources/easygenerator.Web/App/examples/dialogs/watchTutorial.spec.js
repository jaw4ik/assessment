import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import WatchTutorial from 'examples/dialogs/watchTutorial';

describe('dialog [watchTutorial]', () => {
    let viewModel,
        title = 'some title',
        url = 'someUrl',
        callback = function() {};

    beforeEach(() => {
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
        spyOn(dialog, 'on');
        spyOn(dialog, 'off');
    });

    describe('ctor:', () => {
        it('should define title, url and callback', () => {
            viewModel = new WatchTutorial(title, url, callback);
            expect(viewModel.title).toBe(title);
            expect(viewModel.url).toBe(url);
            expect(viewModel.callback).toBe(callback);
        });
    });

    describe('show:', () => {
        it('should call dialog show', () => {
            viewModel = new WatchTutorial(title, url, callback);
            viewModel.show();
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.watchTutorial.settings);
        }); 
    });

    describe('submit:', () => {
        beforeEach(() => {
            viewModel = new WatchTutorial(title, url, callback);
            viewModel.submit();
        });

        it('should call dialog close', () => {
            expect(dialog.close).toHaveBeenCalled();
        });
        
        it('should call dialog on', () => {
            expect(dialog.on).toHaveBeenCalled();
            expect(dialog.on.calls.mostRecent().args[0]).toBe(constants.dialogs.dialogClosed);
        }); 
    });

    describe('closed:', () => {
        let someVariable;

        beforeEach(() => {
            someVariable = '';
            viewModel = new WatchTutorial(title, url, function() {
                someVariable = 'test';
            });

            viewModel.closed();
        });

        it('should call dialog off', () => {
            expect(dialog.off).toHaveBeenCalledWith(constants.dialogs.dialogClosed);
        });
        
        it('should call callback', () => {
            expect(someVariable).toBe('test');
        }); 
    });
});