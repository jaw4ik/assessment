import TemplateBrief from 'dialogs/course/common/templateSelector/templateBrief';

let template = {
    id: 'id',
    name: 'name',
    thumbnail: 'thumb',
    previewImages: [{}],
    shortDescription: 'description',
    order: 0,
    goal: 'Make you happy'
},
    viewModel;

describe('dialog course common templateSelector [templateBrief]', () => {

    beforeEach(() => {
        viewModel = new TemplateBrief(template);
    });

    describe('id:', () => {
        it('should be set', () => {
            expect(viewModel.id).toBe(template.id);
        });
    });

    describe('name:', () => {
        it('should be set', () => {
            expect(viewModel.name).toBe(template.name);
        });
    });

    describe('goal:', () => {
        it('should be set', () => {
            expect(viewModel.goal).toBe(template.goal);
        });
    });

    describe('thumbnail:', () => {
        it('should be set', () => {
            expect(viewModel.thumbnail).toBe(template.thumbnail);
        });
    });

    describe('description:', () => {
        it('should be set', () => {
            expect(viewModel.description).toBe(template.shortDescription);
        });
    });

    describe('order:', () => {
        it('should be set', () => {
            expect(viewModel.order).toBe(template.order);
        });
    });

    describe('previewImages:', () => {
        it('should be set', () => {
            expect(viewModel.previewImages).toBe(template.previewImages);
        });
    });

    describe('isAdvanced:', () => {
        it('should be false', () => {
            expect(viewModel.isAdvanced).toBeFalsy();
        });
    });
});
