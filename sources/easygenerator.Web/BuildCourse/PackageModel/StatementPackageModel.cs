﻿
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class StatementPackageModel : MultipleselectPackageModel
    {
        public override string Type => Question.QuestionTypes.Statement;
    }
}