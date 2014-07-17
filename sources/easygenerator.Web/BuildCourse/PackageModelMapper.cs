﻿using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.Extensions;
using System;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.Web.BuildCourse
{
    public class PackageModelMapper
    {
        public virtual CoursePackageModel MapCourse(Course course)
        {
            if (course == null)
                throw new ArgumentNullException();

            return new CoursePackageModel()
            {
                Id = course.Id.ToNString(),
                Title = course.Title,
                HasIntroductionContent = !String.IsNullOrWhiteSpace(course.IntroductionContent),
                IntroductionContent = course.IntroductionContent,
                Objectives = (course.RelatedObjectives ?? new Collection<Objective>()).Select(MapObjective).ToList()
            };
        }

        private ObjectivePackageModel MapObjective(Objective objective)
        {
            return new ObjectivePackageModel
            {
                Id = objective.Id.ToNString(),
                Title = objective.Title,
                Questions = (objective.Questions ?? new Collection<Question>()).Select(MapQuestion).ToList()
            };
        }

        private QuestionPackageModel MapQuestion(Question question)
        {
            if (question is FillInTheBlanks)
            {
                return MapFillInTheBlanks(question as FillInTheBlanks);
            }
            if (question is SingleSelectText)
            {
                return MapSingleSelectText(question as SingleSelectText);
            }
            if (question is Multipleselect)
            {
                return MapMultipleselect(question as Multipleselect);
            }
            if (question is DragAndDropText)
            {
                return MapDragAndDropText(question as DragAndDropText);
            }
            if (question is TextMatching)
            {
                return MapTextMatching(question as TextMatching);
            }
            if (question is SingleSelectImage)
            {
                return MapSingleSelectImage(question as SingleSelectImage);
            }

            throw new NotSupportedException();
        }

        private SingleSelectImagePackageModel MapSingleSelectImage(SingleSelectImage question)
        {
            return MapQuestion<SingleSelectImagePackageModel>(question, (model) =>
            {
                model.Answers = question.Answers.Select(MapSingleSelectImageAnswer).ToList();
                model.CorrectAnswerId = question.CorrectAnswer == null ? null : question.CorrectAnswer.Id.ToNString();
            });
        }

        private TextMatchingPackageModel MapTextMatching(TextMatching question)
        {
            return MapQuestion<TextMatchingPackageModel>(question, (model) =>
            {
                model.Answers = (question.Answers ?? new Collection<TextMatchingAnswer>()).Select(MapTextMatchingAnswer).ToList();
            });
        }

        private MultipleselectPackageModel MapMultipleselect(Multipleselect question)
        {
            return MapQuestion<MultipleselectPackageModel>(question, (model) =>
            {
                model.Answers = question.Answers.Select(MapAnswer).ToList();
            });
        }

        private SingleSelectTextPackageModel MapSingleSelectText(SingleSelectText question)
        {
            return MapQuestion<SingleSelectTextPackageModel>(question, (model) =>
            {
                model.Answers = (question.Answers ?? new Collection<Answer>()).Select(MapAnswer).ToList();
            });
        }

        private FillInTheBlanksPackageModel MapFillInTheBlanks(FillInTheBlanks question)
        {
            return MapQuestion<FillInTheBlanksPackageModel>(question, (model) =>
            {
                model.Answers = question.Answers.Select(MapAnswer).ToList();
            });
        }

        private DragAndDropTextPackageModel MapDragAndDropText(DragAndDropText question)
        {
            return MapQuestion<DragAndDropTextPackageModel>(question, (model) =>
            {
                model.Background = question.Background;
                model.Dropspots = (question.Dropspots ?? new Collection<Dropspot>()).Select(MapDropspot).ToList();
            });
        }

        private T MapQuestion<T>(Question question, Action<T> updateQuestionModel)
            where T : QuestionPackageModel, new()
        {
            var model = new T();
            MapQuestionProperties(model, question);
            updateQuestionModel(model);

            return model;
        }

        private void MapQuestionProperties(QuestionPackageModel packageModel, Question question)
        {
            packageModel.Id = question.Id.ToNString();
            packageModel.Title = question.Title;
            packageModel.HasContent = !String.IsNullOrEmpty(question.Content);
            packageModel.Content = question.Content;
            packageModel.LearningContents =
                (question.LearningContents ?? new Collection<LearningContent>()).Select(MapLearningContent).ToList();
            packageModel.Feedback = question.Feedback ?? new Feedback();
            packageModel.HasCorrectFeedback = !String.IsNullOrWhiteSpace(question.Feedback.CorrectText);
            packageModel.HasIncorrectFeedback = !String.IsNullOrWhiteSpace(question.Feedback.IncorrectText);
        }

        private AnswerOptionPackageModel MapAnswer(Answer answer)
        {
            return new AnswerOptionPackageModel()
            {
                Id = answer.Id.ToNString(),
                Text = answer.Text,
                Group = answer.Group.ToNString(),
                IsCorrect = answer.IsCorrect
            };
        }

        private SingleSelectImageAnswerPackageModel MapSingleSelectImageAnswer(SingleSelectImageAnswer answer)
        {
            return new SingleSelectImageAnswerPackageModel()
            {
                Id = answer.Id.ToNString(),
                Image = answer.Image
            };
        }

        private DropspotPackageModel MapDropspot(Dropspot dropspot)
        {
            return new DropspotPackageModel()
            {
                Id = dropspot.Id.ToNString(),
                Text = dropspot.Text,
                X = dropspot.X,
                Y = dropspot.Y
            };
        }

        private LearningContentPackageModel MapLearningContent(LearningContent learningContent)
        {
            return new LearningContentPackageModel()
            {
                Id = learningContent.Id.ToNString(),
                Text = learningContent.Text
            };
        }

        private TextMatchingAnswerPackageModel MapTextMatchingAnswer(TextMatchingAnswer answer)
        {
            return new TextMatchingAnswerPackageModel()
            {
                Id = answer.Id.ToNString(),
                Key = answer.Key,
                Value = answer.Value
            };
        }
    }
}