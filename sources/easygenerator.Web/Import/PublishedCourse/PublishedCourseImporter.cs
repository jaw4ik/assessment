using System;
using System.IO;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Import.PublishedCourse.EntityReaders;
using Newtonsoft.Json.Linq;

namespace easygenerator.Web.Import.PublishedCourse
{
    public class PublishedCourseImporter
    {
        public PublishedCourseImporter() { }

        public PublishedCourseImporter(PhysicalFileManager physicalFileManager,
            ImportContentReader importContentReader,
            PublishedCourseStructureReader publishedCourseStructureReader,
            CourseEntityReader courseEntityReader,
            ObjectiveEntityReader objectiveEntityReader,
            QuestionEntityReader questionEntityReader,
            AnswerEntityReader answerEntityReader,
            LearningContentEntityReader learningContentEntityReader)
        {
            _physicalFileManager = physicalFileManager;
            _importContentReader = importContentReader;
            _publishedCourseStructureReader = publishedCourseStructureReader;
            _courseEntityReader = courseEntityReader;
            _objectiveEntityReader = objectiveEntityReader;
            _questionEntityReader = questionEntityReader;
            _answerEntityReader = answerEntityReader;
            _learningContentEntityReader = learningContentEntityReader;
        }

        private readonly PhysicalFileManager _physicalFileManager;
        private readonly ImportContentReader _importContentReader;
        private readonly CourseEntityReader _courseEntityReader;
        private readonly ObjectiveEntityReader _objectiveEntityReader;
        private readonly QuestionEntityReader _questionEntityReader;
        private readonly PublishedCourseStructureReader _publishedCourseStructureReader;
        private readonly AnswerEntityReader _answerEntityReader;
        private readonly LearningContentEntityReader _learningContentEntityReader;


        public virtual Course Import(string publishedPackagePath, string createdBy)
        {
            if (!_physicalFileManager.DirectoryExists(publishedPackagePath))
            {
                throw new ArgumentException("Published package not found");
            }

            string courseDataFilePath = Path.Combine(publishedPackagePath, "content", "data.js");
            JObject courseData = JObject.Parse(_importContentReader.ReadContent(courseDataFilePath));

            return ImportCourse(publishedPackagePath, createdBy, courseData);
        }

        private Course ImportCourse(string publishedPackagePath, string createdBy, JObject courseData)
        {
            var course = _courseEntityReader.ReadCourse(publishedPackagePath, createdBy, courseData);
            int objectivesCounter = 0;

            foreach (Guid objectiveId in _publishedCourseStructureReader.GetObjectives(courseData))
            {
                var objective = ImportObjective(objectiveId, publishedPackagePath, createdBy, courseData);

                course.RelateObjective(objective, objectivesCounter, createdBy);
                objectivesCounter++;
            }

            return course;
        }

        private Objective ImportObjective(Guid objectiveId, string publishedPackagePath, string createdBy, JObject courseData)
        {
            var objective = _objectiveEntityReader.ReadObjective(objectiveId, createdBy, courseData);
            var questionTypes = _publishedCourseStructureReader.GetQuestionTypes(objectiveId, courseData);

            foreach (Tuple<Guid, int> questionTuple in questionTypes)
            {
                Question question = null;
                var questionid = questionTuple.Item1;
                int questionType = questionTuple.Item2;

                switch (questionType)
                {
                    case 0:
                        question = ImportMultipleSelectQuestion(questionid, publishedPackagePath, createdBy, courseData);
                        break;
                    case 1:
                        question = ImportFillInTheBlanksQuestion(questionid, publishedPackagePath, createdBy, courseData);
                        break;
                    case 2:
                        question = ImportDragAndDropTextQuestion(questionid, publishedPackagePath, createdBy, courseData);
                        break;
                    case 3:
                        question = ImportSingleSelectTextQuestion(questionid, publishedPackagePath, createdBy, courseData);
                        break;
                    default:
                        throw new Exception("Unsupported question type");
                }

                objective.AddQuestion(question, createdBy);
            }

            return objective;
        }

        private Multipleselect ImportMultipleSelectQuestion(Guid questionId, string publishedPackagePath, string createdBy, JObject courseData)
        {
            var question = _questionEntityReader.ReadMultipleSelectQuestion(questionId, publishedPackagePath, createdBy, courseData);

            foreach (Guid answerId in _publishedCourseStructureReader.GetAnswers(questionId, courseData))
            {
                var answer = _answerEntityReader.ReadAnswer(answerId, createdBy, courseData);
                question.AddAnswer(answer, createdBy);
            }

            foreach (Guid learningContentId in _publishedCourseStructureReader.GetLearningContents(questionId, courseData))
            {
                var learningContent = _learningContentEntityReader.ReadLearningContent(learningContentId, publishedPackagePath,
                    createdBy, courseData);
                question.AddLearningContent(learningContent, createdBy);
            }

            return question;
        }

        private FillInTheBlanks ImportFillInTheBlanksQuestion(Guid questionId, string publishedPackagePath, string createdBy, JObject courseData)
        {
            var question = _questionEntityReader.ReadFillInTheBlanksQuestion(questionId, publishedPackagePath, createdBy, courseData);

            foreach (Guid answerId in _publishedCourseStructureReader.GetAnswers(questionId, courseData))
            {
                var answer = _answerEntityReader.ReadAnswer(answerId, createdBy, courseData);
                question.AddAnswer(answer, createdBy);
            }

            foreach (Guid learningContentId in _publishedCourseStructureReader.GetLearningContents(questionId, courseData))
            {
                var learningContent = _learningContentEntityReader.ReadLearningContent(learningContentId, publishedPackagePath,
                    createdBy, courseData);
                question.AddLearningContent(learningContent, createdBy);
            }

            return question;
        }

        private SingleSelectText ImportSingleSelectTextQuestion(Guid questionId, string publishedPackagePath, string createdBy, JObject courseData)
        {
            var question = _questionEntityReader.ReadSingleSelectTextQuestion(questionId, publishedPackagePath, createdBy, courseData);

            foreach (Guid answerId in _publishedCourseStructureReader.GetAnswers(questionId, courseData))
            {
                var answer = _answerEntityReader.ReadAnswer(answerId, createdBy, courseData);
                question.AddAnswer(answer, createdBy);
            }

            foreach (Guid learningContentId in _publishedCourseStructureReader.GetLearningContents(questionId, courseData))
            {
                var learningContent = _learningContentEntityReader.ReadLearningContent(learningContentId, publishedPackagePath,
                    createdBy, courseData);
                question.AddLearningContent(learningContent, createdBy);
            }

            return question;
        }

        private DragAndDropText ImportDragAndDropTextQuestion(Guid questionId, string publishedPackagePath, string createdBy, JObject courseData)
        {
            var question = _questionEntityReader.ReadDragAndDropTextQuestion(questionId, publishedPackagePath, createdBy, courseData);

            foreach (Guid dropspotId in _publishedCourseStructureReader.GetDropspots(questionId, courseData))
            {
                var dropSpot = _answerEntityReader.ReadDropspot(dropspotId, createdBy, courseData);
                question.AddDropspot(dropSpot, createdBy);
            }

            foreach (Guid learningContentId in _publishedCourseStructureReader.GetLearningContents(questionId, courseData))
            {
                var learningContent = _learningContentEntityReader.ReadLearningContent(learningContentId, publishedPackagePath,
                    createdBy, courseData);
                question.AddLearningContent(learningContent, createdBy);
            }

            return question;
        }

    }
}