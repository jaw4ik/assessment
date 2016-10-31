import ko from 'knockout';
import $ from 'jquery';
import _ from 'underscore';

ko.bindingHandlers.lazyForeach = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        let data = _.isArray(ko.unwrap(valueAccessor())) ? ko.unwrap(valueAccessor()) : ko.unwrap(valueAccessor().data),
            step = valueAccessor().step || 10,
            offset = valueAccessor().offset || 400,
            $scrollableContainer = $(valueAccessor().scrollableContainer || window);

        element.fullCollection = _.clone(data);
        element.visibleCollection = ko.observableArray();

        let subscription = element.visibleCollection.subscribe(newArray => {
            if (!_.isEmpty(element.fullCollection) && newArray.length >= element.fullCollection.length) {
                $scrollableContainer.off('scroll', checkOffset);
                subscription.dispose();
            } else {
                _.defer(() => checkOffset());
            }
        });

        $scrollableContainer.on('scroll', checkOffset);
        checkOffset();

        return ko.bindingHandlers.foreach.init(element, () => ({ data: element.visibleCollection }), allBindings, viewModel, bindingContext);

        function checkOffset() {
            let $element = $(element).parent();
            let documentOffset = $scrollableContainer.scrollTop() + $scrollableContainer.height() + (($scrollableContainer.offset() ? $scrollableContainer.offset().top : 0) - $element.offset().top);
            let elementOffsetBottom = $element.height() - documentOffset;

            if (elementOffsetBottom <= offset) {
                pushChunk();
            }
        }

        function pushChunk() {
            ko.utils.arrayPushAll(element.visibleCollection, _.chain(element.fullCollection)
                .rest(element.visibleCollection().length)
                .first(step)
                .value());
        }
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        let data = _.isArray(ko.unwrap(valueAccessor())) ? ko.unwrap(valueAccessor()) : ko.unwrap(valueAccessor().data);

        if (_.isEmpty(element.fullCollection)) {
            element.fullCollection = _.clone(data);
        } else {
            _.chain(element.fullCollection)
                .difference(data)
                .each(item => {
                    element.fullCollection = _.without(element.fullCollection, item);
                    element.visibleCollection.remove(item);
                });

            _.chain(data)
                .difference(element.fullCollection)
                .each(item => {
                    let index = _.indexOf(data, item);
                    element.fullCollection.splice(index, 0, item);
                    element.visibleCollection.splice(index, 0, item);
                });
        }

        return ko.bindingHandlers.foreach.update(element, () => ({ data: element.visibleCollection }), allBindings, viewModel, bindingContext);
    }
};

ko.virtualElements.allowedBindings.lazyForeach = true;