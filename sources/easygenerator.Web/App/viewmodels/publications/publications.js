define(['dataContext'],
    function (dataContext) {
        var
            publications = ko.observableArray([]),
            activate = function () {
                publications([
                    { title: '1' },
                    { title: '2' },
                    { title: '3' }
                ]);
            };

        return {
            activate: activate,
            publications: publications
        };
    }
);