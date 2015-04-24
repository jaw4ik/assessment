﻿using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class SingleSelectTextPackageModel : MultipleselectPackageModel
    {
        public override string Type
        {
            get { return Question.QuestionTypes.SingleSelectText; }
        }
    }
}