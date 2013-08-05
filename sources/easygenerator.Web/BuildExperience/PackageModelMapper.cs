using System;
using System.Collections.Generic;
using Antlr.Runtime.Misc;
using easygenerator.Web.BuildExperience.BuildModel;
using easygenerator.Web.BuildExperience.PackageModel;

namespace easygenerator.Web.BuildExperience
{
    public class PackageModelMapper
    {
        public virtual ExplanationPackageModel MapExplanationBuildModel(ExplanationBuildModel explanationBuildModel)
        {
            if (explanationBuildModel == null)
                throw new ArgumentNullException();

            return new ExplanationPackageModel()
            {
                Id = explanationBuildModel.Id
            };
        }

        public virtual AnswerOptionPackageModel MapAnswerOptionBuildModel(AnswerOptionBuildModel answerOptionBuildModel)
        {
            if (answerOptionBuildModel == null)
                throw new ArgumentNullException();

            return new AnswerOptionPackageModel()
            {
                Id = answerOptionBuildModel.Id,
                Text = answerOptionBuildModel.Text,
                IsCorrect = answerOptionBuildModel.IsCorrect
            };
        }

        public virtual QuestionPackageModel MapQuestionBuildModel(QuestionBuildModel questionBuildModel)
        {
            if (questionBuildModel == null)
                throw new ArgumentNullException();

            var mappedQuestionBuildModel = new QuestionPackageModel()
            {
                Id = questionBuildModel.Id,
                Title = questionBuildModel.Title,
                Answers = new List<AnswerOptionPackageModel>(),
                Explanations = new List<ExplanationPackageModel>()
            };

            foreach (AnswerOptionBuildModel answerOptionBuildModel in questionBuildModel.AnswerOptions)
                mappedQuestionBuildModel.Answers.Add(MapAnswerOptionBuildModel(answerOptionBuildModel));

            foreach (ExplanationBuildModel explanationBuildModel in questionBuildModel.Explanations)
                mappedQuestionBuildModel.Explanations.Add(MapExplanationBuildModel(explanationBuildModel));

            return mappedQuestionBuildModel;
        }

        public virtual ObjectivePackageModel MapObjectiveBuildModel(ObjectiveBuildModel objectiveBuildModel)
        {
            if (objectiveBuildModel == null)
                throw new ArgumentNullException();

            var mappedObjectiveBuildModel = new ObjectivePackageModel()
            {
                Id = objectiveBuildModel.Id,
                Title = objectiveBuildModel.Title,
                Image = objectiveBuildModel.Image,
                Questions = new List<QuestionPackageModel>()
            };

            foreach (QuestionBuildModel questionBuildModel in objectiveBuildModel.Questions)
                mappedObjectiveBuildModel.Questions.Add(MapQuestionBuildModel(questionBuildModel));

            return mappedObjectiveBuildModel;
        }

        public virtual ExperiencePackageModel MapExperienceBuildModel(ExperienceBuildModel experienceBuildModel)
        {
            if (experienceBuildModel == null)
                throw new ArgumentNullException();

            var mappedExperienceBuildModel = new ExperiencePackageModel()
            {
                Id = experienceBuildModel.Id,
                Title = experienceBuildModel.Title,
                Objectives = new ListStack<ObjectivePackageModel>()
            };

            foreach (ObjectiveBuildModel objectiveBuildModel in experienceBuildModel.Objectives)
                mappedExperienceBuildModel.Objectives.Add(MapObjectiveBuildModel(objectiveBuildModel));

            return mappedExperienceBuildModel;
        }
    }
}