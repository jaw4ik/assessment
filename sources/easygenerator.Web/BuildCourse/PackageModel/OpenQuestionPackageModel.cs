﻿using easygenerator.DomainModel.Entities.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class OpenQuestionPackageModel : QuestionPackageModel
    {
        public override string Type
        {
            get { return Question.QuestionTypes.OpenQuestion; }
        }
    }
}