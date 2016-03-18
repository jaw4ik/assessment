using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Import.WinToWeb.Model;

namespace easygenerator.Web.Import.WinToWeb
{
    public interface IWinToWebCourseImporter
    {
        Course Import(WinCourse winCourse, string userName);
    }

    public class WinToWebCourseImporter : IWinToWebCourseImporter
    {
        private readonly IEntityFactory _entityFactory;
        private readonly ICourseRepository _courseRepository;
        private readonly ITemplateRepository _templateRepository;

        public WinToWebCourseImporter(IEntityFactory entityFactory, ICourseRepository courseRepository, ITemplateRepository templateRepository)
        {
            _entityFactory = entityFactory;
            _courseRepository = courseRepository;
            _templateRepository = templateRepository;
        }

        private void MapLearningContent(WinQuestion winQuestion, Question question, string userName)
        {
            foreach (var lc in winQuestion.LearningContents.Select(winLearningContent => _entityFactory.LearningContent(winLearningContent.Text, userName)))
            {
                question.AddLearningContent(lc, userName);
            }
        }

        private void MapAnswers(WinQuestion winQuestion, Multipleselect question, string userName)
        {
            foreach (var answer in winQuestion.Answers.Select(winAnswer => _entityFactory.Answer(winAnswer.Text,
                winAnswer.IsCorrect != null && winAnswer.IsCorrect.Value, userName)))
            {
                question.AddAnswer(answer, userName);
            }
        }

        private void UpdateFeedbacks(WinQuestion winQuestion, Question question)
        {
            if (!string.IsNullOrEmpty(winQuestion.CorrectFeedback))
            {
                question.UpdateCorrectFeedbackText(winQuestion.CorrectFeedback);
            }

            if (!string.IsNullOrEmpty(winQuestion.IncorrectFeedback))
            {
                question.UpdateIncorrectFeedbackText(winQuestion.IncorrectFeedback);
            }
        }

        public Course Import(WinCourse winCourse, string userName)
        {
            var course = _entityFactory.Course(winCourse.Title, _templateRepository.GetDefaultTemplate(), userName);

            if (!string.IsNullOrEmpty(winCourse.Introduction))
            {
                course.UpdateIntroductionContent(winCourse.Introduction, userName);
            }

            foreach (var winObjective in winCourse.Objectives)
            {
                var section = _entityFactory.Section(winObjective.Title, userName);
                
                foreach (var winQuestion in winObjective.Questions)
                {
                    switch (winQuestion.Type)
                    {
                        case Question.QuestionTypes.InformationContent:
                            var informationContent = _entityFactory.InformationContent(winQuestion.Title, userName);
                            MapLearningContent(winQuestion, informationContent, userName);
                            section.AddQuestion(informationContent, userName);
                            break;
                        case Question.QuestionTypes.SingleSelectText:
                            var singleSelectText = _entityFactory.SingleSelectTextQuestion(winQuestion.Title, userName);
                            MapAnswers(winQuestion, singleSelectText, userName);
                            MapLearningContent(winQuestion, singleSelectText, userName);
                            if (!string.IsNullOrEmpty(winQuestion.Content))
                            {
                                singleSelectText.UpdateContent(winQuestion.Content, userName);
                            }
                            UpdateFeedbacks(winQuestion, singleSelectText);
                            section.AddQuestion(singleSelectText, userName);
                            break;
                        case Question.QuestionTypes.MultipleSelect:
                            var multipleSelect = _entityFactory.MultipleselectQuestion(winQuestion.Title, userName);
                            MapAnswers(winQuestion, multipleSelect, userName);
                            MapLearningContent(winQuestion, multipleSelect, userName);
                            if (!string.IsNullOrEmpty(winQuestion.Content))
                            {
                                multipleSelect.UpdateContent(winQuestion.Content, userName);
                            }
                            UpdateFeedbacks(winQuestion, multipleSelect);
                            section.AddQuestion(multipleSelect, userName);
                            break;
                        case Question.QuestionTypes.SingleSelectImage:
                            var singleSelectImage  = _entityFactory.SingleSelectImageQuestion(winQuestion.Title, userName);
                            foreach (var winAnswer in winQuestion.Answers)
                            {
                                var answer = _entityFactory.SingleSelectImageAnswer(winAnswer.Image, userName);
                                singleSelectImage.AddAnswer(answer, userName);
                                if (winAnswer.IsCorrect != null && winAnswer.IsCorrect.Value)
                                {
                                    singleSelectImage.SetCorrectAnswer(answer, userName);
                                }
                            }
                            MapLearningContent(winQuestion, singleSelectImage, userName);
                            if (!string.IsNullOrEmpty(winQuestion.Content))
                            {
                                singleSelectImage.UpdateContent(winQuestion.Content, userName);
                            }
                            UpdateFeedbacks(winQuestion, singleSelectImage);
                            section.AddQuestion(singleSelectImage, userName);
                            break;
                        case Question.QuestionTypes.HotSpot:
                            var hotSpot = _entityFactory.HotSpot(winQuestion.Title, userName);
                            hotSpot.ChangeBackground(winQuestion.Background, userName);
                            hotSpot.ChangeType(winQuestion.IsMultiple ?? false, userName);
                            foreach (var winHotspotPolygon in winQuestion.HotspotPolygons)
                            {
                                var hsAnswer = _entityFactory.HotSpotPolygon(winHotspotPolygon.Points, userName);
                                hotSpot.AddHotSpotPolygon(hsAnswer, userName);
                            }
                            MapLearningContent(winQuestion, hotSpot, userName);
                            if (!string.IsNullOrEmpty(winQuestion.Content))
                            {
                                hotSpot.UpdateContent(winQuestion.Content, userName);
                            }
                            UpdateFeedbacks(winQuestion, hotSpot);
                            section.AddQuestion(hotSpot, userName);
                            break;
                        case Question.QuestionTypes.Statement:
                            var statement = _entityFactory.StatementQuestion(winQuestion.Title, userName);
                            MapAnswers(winQuestion, statement, userName);
                            MapLearningContent(winQuestion, statement, userName);
                            if (!string.IsNullOrEmpty(winQuestion.Content))
                            {
                                statement.UpdateContent(winQuestion.Content, userName);
                            }
                            UpdateFeedbacks(winQuestion, statement);
                            section.AddQuestion(statement, userName);
                            break;
                        case Question.QuestionTypes.OpenQuestion:
                            var openQuestion = _entityFactory.OpenQuestion(winQuestion.Title, userName);
                            MapLearningContent(winQuestion, openQuestion, userName);
                            if (!string.IsNullOrEmpty(winQuestion.Content))
                            {
                                openQuestion.UpdateContent(winQuestion.Content, userName);
                            }
                            UpdateFeedbacks(winQuestion, openQuestion);
                            section.AddQuestion(openQuestion, userName);
                            break;
                        case Question.QuestionTypes.TextMatching:
                            var textmatching = _entityFactory.TextMatchingQuestion(winQuestion.Title, userName);
                            foreach (var winAnswer in winQuestion.Answers)
                            {
                                var answer = _entityFactory.TextMatchingAnswer(winAnswer.Key, winAnswer.Value,
                                    userName);
                                textmatching.AddAnswer(answer, userName);
                            }
                            MapLearningContent(winQuestion, textmatching, userName);
                            if (!string.IsNullOrEmpty(winQuestion.Content))
                            {
                                textmatching.UpdateContent(winQuestion.Content, userName);
                            }
                            UpdateFeedbacks(winQuestion, textmatching);
                            section.AddQuestion(textmatching, userName);
                            break;
                        case Question.QuestionTypes.FillInTheBlanks:
                            var fillInTheBlanks = _entityFactory.FillInTheBlanksQuestion(winQuestion.Title, userName);
                            foreach (var winAnswer in winQuestion.Answers)
                            {
                                var answer = _entityFactory.BlankAnswer(winAnswer.Text, winAnswer.IsCorrect ?? false, winAnswer.MatchCase,
                                    winAnswer.GroupId, userName);
                                fillInTheBlanks.AddAnswer(answer, userName);
                            }
                            MapLearningContent(winQuestion, fillInTheBlanks, userName);
                            if (!string.IsNullOrEmpty(winQuestion.Content))
                            {
                                fillInTheBlanks.UpdateContent(winQuestion.Content, userName);
                            }
                            UpdateFeedbacks(winQuestion, fillInTheBlanks);
                            section.AddQuestion(fillInTheBlanks, userName);
                            break;
                    }
                }
                course.RelateSection(section, null, userName);
            }

            _courseRepository.Add(course);

            return course;
        }
    }
}