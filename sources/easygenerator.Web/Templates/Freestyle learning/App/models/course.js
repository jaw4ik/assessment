define([],
    function () {
        
        function Course(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.hasIntroductionContent = spec.hasIntroductionContent;
            this.objectives = spec.objectives;
        }

        return Course;
    }
);