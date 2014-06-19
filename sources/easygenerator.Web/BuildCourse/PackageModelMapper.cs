using System;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.Extensions;

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
            if (question is Multiplechoice)
            {
                return MapMultiplechoice(question as Multiplechoice);
            }
            if (question is Multipleselect)
            {
                return MapMultipleselect(question as Multipleselect);
            }
            if (question is DragAndDropText)
            {
                return MapDragAndDropText(question as DragAndDropText);
            }
            throw new NotSupportedException();
        }

        private MultipleselectPackageModel MapMultipleselect(Multipleselect question)
        {
            return new MultipleselectPackageModel()
            {
                Id = question.Id.ToNString(),
                Title = question.Title,
                HasContent = !String.IsNullOrWhiteSpace(question.Content),
                Content = question.Content,
                Answers = question.Answers.Select(MapAnswer).ToList(),
                LearningContents = (question.LearningContents ?? new Collection<LearningContent>()).Select(MapLearningContent).ToList(),
            };
        }

        private MultiplechoicePackageModel MapMultiplechoice(Multiplechoice question)
        {
            return new MultiplechoicePackageModel()
            {
                Id = question.Id.ToNString(),
                Title = question.Title,
                HasContent = !String.IsNullOrWhiteSpace(question.Content),
                Content = question.Content,
                Answers = (question.Answers ?? new Collection<Answer>()).Select(MapAnswer).ToList(),
                LearningContents = (question.LearningContents ?? new Collection<LearningContent>()).Select(MapLearningContent).ToList(),
            };
        }

        private FillInTheBlanksPackageModel MapFillInTheBlanks(FillInTheBlanks question)
        {
            return new FillInTheBlanksPackageModel()
            {
                Id = question.Id.ToNString(),
                Title = question.Title,
                HasContent = !String.IsNullOrWhiteSpace(question.Content),
                Content = question.Content,
                Answers = question.Answers.Select(MapAnswer).ToList(),
                LearningContents = (question.LearningContents ?? new Collection<LearningContent>()).Select(MapLearningContent).ToList(),
            };
        }

        private DragAndDropTextPackageModel MapDragAndDropText(DragAndDropText question)
        {
            return new DragAndDropTextPackageModel()
            {
                Id = question.Id.ToNString(),
                Title = question.Title,
                Background = question.Background,
                HasContent = false,
                Content = null,
                LearningContents = (question.LearningContents ?? new Collection<LearningContent>()).Select(MapLearningContent).ToList(),
                Dropspots = (question.Dropspots ?? new Collection<Dropspot>()).Select(MapDropspot).ToList()
            };

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
    }
}