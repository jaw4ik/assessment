using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using Newtonsoft.Json;

namespace easygenerator.Web.BuildCourse
{
    public class PackageModelMapper
    {
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly IUserRepository _userRepository;

        public PackageModelMapper(IUrlHelperWrapper urlHelper, IUserRepository userRepository)
        {
            _urlHelper = urlHelper;
            _userRepository = userRepository;
        }

        public virtual CoursePackageModel MapCourse(Course course)
        {
            if (course == null)
                throw new ArgumentNullException();

            var author = _userRepository.GetUserByEmail(course.CreatedBy);

            return new CoursePackageModel()
            {
                Id = course.Id.ToNString(),
                Title = course.Title,
                CreatedBy = author != null ? author.FullName : null,
                CreatedOn = DateTimeWrapper.Now(),
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
                ImageUrl = String.IsNullOrEmpty(objective.ImageUrl)
                    ? _urlHelper.ToAbsoluteUrl(Constants.Objective.DefaultImageUrl)
                    : objective.ImageUrl,
                Questions = (objective.Questions ?? new Collection<Question>()).Select(MapQuestion).ToList()
            };
        }

        private QuestionPackageModel MapQuestion(Question question)
        {
            var questionType = question.GetObjectType();

            if (questionType == typeof(FillInTheBlanks))
            {
                return MapFillInTheBlanks(question as FillInTheBlanks);
            }
            if (questionType == typeof(Statement))
            {
                return MapStatement(question as Statement);
            }
            if (questionType == typeof(SingleSelectText))
            {
                return MapSingleSelectText(question as SingleSelectText);
            }
            if (questionType == typeof(Multipleselect))
            {
                return MapMultipleselect(question as Multipleselect);
            }
            if (questionType == typeof(DragAndDropText))
            {
                return MapDragAndDropText(question as DragAndDropText);
            }
            if (questionType == typeof(HotSpot))
            {
                return MapHotSpot(question as HotSpot);
            }
            if (questionType == typeof(TextMatching))
            {
                return MapTextMatching(question as TextMatching);
            }
            if (questionType == typeof(SingleSelectImage))
            {
                return MapSingleSelectImage(question as SingleSelectImage);
            }
            if (questionType == typeof(InformationContent))
            {
                return MapInformationContent(question as InformationContent);
            }
            if (questionType == typeof(OpenQuestion))
            {
                return MapOpenQuestion(question as OpenQuestion);
            }
            if (questionType == typeof(Scenario))
            {
                return MapScenarioQuestion(question as Scenario);
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

        private InformationContentPackageModel MapInformationContent(InformationContent question)
        {
            return MapQuestion<InformationContentPackageModel>(question);
        }

        private ScenarioQuestionPackageModel MapScenarioQuestion(Scenario question)
        {
            return MapQuestion<ScenarioQuestionPackageModel>(question, (model) =>
            {
                model.ProjectId = question.ProjectId;
                model.EmbedCode = question.EmbedCode;
                model.EmbedUrl = question.EmbedUrl;
                model.ProjectArchiveUrl = question.ProjectArchiveUrl;
                model.MasteryScore = question.MasteryScore;
            });
        }

        private OpenQuestionPackageModel MapOpenQuestion(OpenQuestion question)
        {
            return MapQuestion<OpenQuestionPackageModel>(question);
        }


        private TextMatchingPackageModel MapTextMatching(TextMatching question)
        {
            return MapQuestion<TextMatchingPackageModel>(question, (model) =>
            {
                model.Answers = (question.Answers ?? new Collection<TextMatchingAnswer>()).Select(MapTextMatchingAnswer).ToList();
            });
        }

        private MultipleselectPackageModel MapStatement(Statement question)
        {
            return MapQuestion<StatementPackageModel>(question, (model) =>
            {
                model.Answers = question.Answers.Select(MapAnswer).ToList();
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
                model.AnswerGroups = question.Answers
                    .GroupBy(item => item.GroupId)
                    .Select(group => new BlankAnswerGroupPackageModel()
                    {
                        Id = group.Key.ToNString(),
                        Answers = group.Select(MapBlankAnswer).ToList()
                    }).ToList();
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

        private HotSpotPackageModel MapHotSpot(HotSpot question)
        {
            return MapQuestion<HotSpotPackageModel>(question, (model) =>
            {
                model.Background = question.Background;
                model.IsMultiple = question.IsMultiple;
                model.Spots = (question.HotSpotPolygons ?? new Collection<HotSpotPolygon>()).Select(MapHotSpot).ToList();
            });
        }

        private T MapQuestion<T>(Question question, Action<T> updateQuestionModel = null)
            where T : QuestionPackageModel, new()
        {
            var model = new T();
            MapQuestionProperties(model, question);
            updateQuestionModel?.Invoke(model);

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
            packageModel.VoiceOver = question.VoiceOver;
        }

        private AnswerOptionPackageModel MapAnswer(Answer answer)
        {
            return new AnswerOptionPackageModel()
            {
                Id = answer.Id.ToNString(),
                Text = answer.Text,
                IsCorrect = answer.IsCorrect
            };
        }

        private BlankAnswerPackageModel MapBlankAnswer(BlankAnswer answer)
        {
            return new BlankAnswerPackageModel()
            {
                Id = answer.Id.ToNString(),
                Text = answer.Text,
                IsCorrect = answer.IsCorrect
            };
        }

        private SingleSelectImageAnswerPackageModel MapSingleSelectImageAnswer(SingleSelectImageAnswer answer)
        {
            return new SingleSelectImageAnswerPackageModel()
            {
                Id = answer.Id.ToNString(),
                Image = answer.Image ?? _urlHelper.ToAbsoluteUrl("~/Content/images/singleSelectImageAnswer.png")
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

        private dynamic MapHotSpot(HotSpotPolygon polygon)
        {
            return JsonConvert.DeserializeObject<dynamic>(polygon.Points);
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