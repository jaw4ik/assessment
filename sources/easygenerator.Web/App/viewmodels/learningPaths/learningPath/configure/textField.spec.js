import TextField from './textField.js';

describe('[editableText]', () => {
    let isCallbackCalled,
        callback = () => {
            isCallbackCalled = true;
        },
        viewModel;

    beforeEach(() => {
        isCallbackCalled = false;
        viewModel = new TextField();
    });

    describe('value:', () => {
        it('should be empty', () => {
            expect(viewModel.value()).toBe('');
        });
    });

    describe('originalText:', () => {
        it('should be empty', () => {
            expect(viewModel.originalText).toBe('');
        });
    });
    
    describe('init:', () => {
        it('should set value', () => {
            let text = 'text';
            viewModel.init(text, callback);
            expect(viewModel.value()).toBe(text);
        });

        it('should set onTextChanged', () => {
            let text = 'text';
            viewModel.init(text, callback);
            expect(viewModel.onTextChanged).toBe(callback);
        });

        it('should set originalText', () => {
            let text = 'text';
            viewModel.init(text, callback);
            expect(viewModel.originalText).toBe(text);
        });
    });

    describe('endEdit:', () => {
        describe('when value is the different from original text:', () => {
            let text1 = 'text1',
                text2 = 'text2';

            beforeEach(() => {
                viewModel.init(text1, callback);
                viewModel.value(text2);
            });
            
            it('should set originalText', () => {
                viewModel.endEdit();
                expect(viewModel.originalText).toBe(text2);
            });

            it('should trim originText', () => {
                viewModel.value('        test          ');
                viewModel.endEdit();
                expect(viewModel.originalText).toBe('test');
            });

            it('should call onTextChanged', () => {
                viewModel.endEdit();
                expect(isCallbackCalled).toBeTruthy();
            });
        }); 
    
        describe('when value is the same as original text:', () => {
            beforeEach(() => {
                let text = 'text';
                viewModel.value(text);
                viewModel.originalText = text;
            });
                        
            it('should not call onTextChanged', () => {
                viewModel.endEdit();
                expect(isCallbackCalled).toBeFalsy();
            });
        }); 
    });
});