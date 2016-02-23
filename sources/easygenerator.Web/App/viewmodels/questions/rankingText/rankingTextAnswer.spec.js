import RankingTextAnswer from './rankingTextAnswer.js';


let id = 'id',
    text = 'text',
    viewModel;

describe('[rankingTextAnswer]', () => {
    beforeEach(() => {
        viewModel = new RankingTextAnswer(id, text);
    });

    describe('id:', function () {
        it('should be set', function () {
            expect(viewModel.id).toBe(id);
        });
    });

    describe('text:', function () {
        it('should be observable', function () {
            expect(viewModel.text).toBeObservable();
        });

        it('should be set', function () {
            expect(viewModel.text()).toBe(text);
        });
    });

    describe('original:', function () {
        it('should be set to text', function () {
            expect(viewModel.text.original).toBe(text);
        });
    });

    describe('isEditing:', function () {
        it('should be observable', function () {
            expect(viewModel.text.isEditing).toBeObservable();
        });

        it('should be set to false', () => {
            expect(viewModel.text.isEditing()).toBeFalsy();
        });
    });
    
});