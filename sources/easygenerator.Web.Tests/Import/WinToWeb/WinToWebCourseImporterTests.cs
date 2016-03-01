using System;
using System.Activities.Expressions;
using System.Collections.Generic;
using System.Xml;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Import.WinToWeb;
using easygenerator.Web.Import.WinToWeb.Model;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Import.WinToWeb
{
    [TestClass]
    public class WinToWebCourseImporterTests
    {
        private IEntityFactory _entityFactory;
        private ICourseRepository _courseRepository;
        private ITemplateRepository _templateRepository;

        private WinToWebCourseImporter _importer;
        private readonly string _userName = "User Name";
        private readonly Guid _templateId = Guid.NewGuid();

        [TestInitialize]
        public void Initialize()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _templateRepository = Substitute.For<ITemplateRepository>();
            _importer = new WinToWebCourseImporter(_entityFactory, _courseRepository, _templateRepository);
        }

        [TestMethod]
        public void Import_ShouldCreateCourse()
        {
            //Arrange
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();

            var course = Substitute.For<Course>();
            _entityFactory.Course(winCourse.Title, Arg.Any<Template>(), _userName).Returns(course);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _courseRepository.Received().Add(course);
        }

        [TestMethod]
        public void Import_ShouldReturnCourse()
        {
            //Arrange
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();

            var course = CourseObjectMother.Create(title: winCourse.Title, createdBy: _userName);
            _entityFactory.Course(winCourse.Title, Arg.Any<Template>(), _userName).Returns(course);

            //Act
            var result = _importer.Import(winCourse, _userName);

            //Assert
            result.Title.Should().Be(winCourse.Title);
        }

        [TestMethod]
        public void Import_ShouldAddWinObjectivesAsObjectiveInCourse()
        {
            //Arrange
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            course.Received().RelateSection(section, Arg.Any<int?>(), Arg.Any<string>());
        }

        #region InformationContent

        [TestMethod]
        public void Import_ShouldCreateInformationContent()
        {
            //Arrange
            var winInformationContent = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.InformationContent,
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
                {
                    winInformationContent
                }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().InformationContent(winInformationContent.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToInformationContent()
        {
            //Arrange
            var winLearningContent = new WinLearningContent()
            {
                Text = "some text <p>foo</p>"
            };
            var winInformationContent = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.InformationContent,
                LearningContents = new List<WinLearningContent>()
                {
                    winLearningContent
                }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
                {
                    winInformationContent
                }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);

            var informationContent = Substitute.For<InformationContent>();
            _entityFactory.InformationContent(Arg.Any<string>(), Arg.Any<string>()).Returns(informationContent);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            informationContent.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddInformationContentToObjective()
        {
            //Arrange
            var winInformationContent = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.InformationContent,
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
                {
                    winInformationContent
                }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var informationContent = Substitute.For<InformationContent>();
            _entityFactory.InformationContent(Arg.Any<string>(), Arg.Any<string>()).Returns(informationContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(informationContent, _userName);
        }

        #endregion

        #region SingleSelectText

        [TestMethod]
        public void Import_ShouldCreateSingleSelectText()
        {
            //Arrange
            var winSingleSelectText = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectText,
                Content = "content",
                Answers = new List<WinAnswer>()
                {
                    new WinAnswer()
                    {
                        Text = "answer1",
                        IsCorrect = true
                    },
                    new WinAnswer()
                    {
                        Text = "answer2",
                        IsCorrect = false
                    }
                },
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
                {
                    winSingleSelectText
                }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var question = Substitute.For<SingleSelectText>();
            _entityFactory.SingleSelectTextQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().SingleSelectTextQuestion(winSingleSelectText.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToSingleSelectText()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winSingleSelectText = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectText,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true }, new WinAnswer() { Text = "answer2", IsCorrect = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winSingleSelectText }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<SingleSelectText>();
            _entityFactory.SingleSelectTextQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            question.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddSingleSelectTextToObjective()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winSingleSelectText = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectText,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true }, new WinAnswer() { Text = "answer2", IsCorrect = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winSingleSelectText }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<SingleSelectText>();
            _entityFactory.SingleSelectTextQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(question, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddAnswersToSingleSelectText()
        {
            //Arrange
            var winAnswer1 = new WinAnswer() { Text = "answer1", IsCorrect = true };
            var winAnswer2 = new WinAnswer() { Text = "answer2", IsCorrect = false };
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winSingleSelectText = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectText,
                Content = "content",
                Answers = new List<WinAnswer>() { winAnswer1, winAnswer2 },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winSingleSelectText }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<SingleSelectText>();
            _entityFactory.SingleSelectTextQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);
            var answer1 = Substitute.For<Answer>();
            var answer2 = Substitute.For<Answer>();

            _entityFactory.Answer(winAnswer1.Text, winAnswer1.IsCorrect.Value, _userName).Returns(answer1);
            _entityFactory.Answer(winAnswer2.Text, winAnswer2.IsCorrect.Value, _userName).Returns(answer2);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            question.Received().AddAnswer(answer1, _userName);
            question.Received().AddAnswer(answer2, _userName);
        }

        #endregion

        #region MultipleSelectText

        [TestMethod]
        public void Import_ShouldCreateMultipleSelectText()
        {
            //Arrange
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.MultipleSelect,
                Content = "content",
                Answers = new List<WinAnswer>()
                {
                    new WinAnswer()
                    {
                        Text = "answer1",
                        IsCorrect = true
                    },
                    new WinAnswer()
                    {
                        Text = "answer2",
                        IsCorrect = false
                    }
                },
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
                {
                    winquestion
                }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var question = Substitute.For<Multipleselect>();
            _entityFactory.MultipleselectQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().MultipleselectQuestion(winquestion.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToMultipleSelectText()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.MultipleSelect,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true }, new WinAnswer() { Text = "answer2", IsCorrect = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<Multipleselect>();
            _entityFactory.MultipleselectQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            question.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddMultipleSelectTextToObjective()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.MultipleSelect,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true }, new WinAnswer() { Text = "answer2", IsCorrect = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<Multipleselect>();
            _entityFactory.MultipleselectQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(question, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddAnswersToMultipleSelectText()
        {
            //Arrange
            var winAnswer1 = new WinAnswer() { Text = "answer1", IsCorrect = true };
            var winAnswer2 = new WinAnswer() { Text = "answer2", IsCorrect = false };
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.MultipleSelect,
                Content = "content",
                Answers = new List<WinAnswer>() { winAnswer1, winAnswer2 },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<Multipleselect>();
            _entityFactory.MultipleselectQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);
            var answer1 = Substitute.For<Answer>();
            var answer2 = Substitute.For<Answer>();

            _entityFactory.Answer(winAnswer1.Text, winAnswer1.IsCorrect.Value, _userName).Returns(answer1);
            _entityFactory.Answer(winAnswer2.Text, winAnswer2.IsCorrect.Value, _userName).Returns(answer2);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            question.Received().AddAnswer(answer1, _userName);
            question.Received().AddAnswer(answer2, _userName);
        }

        #endregion

        #region SingleSelectImage

        [TestMethod]
        public void Import_ShouldCreateSingleSelectImage()
        {
            //Arrange
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectImage,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true, Image = "url" }, new WinAnswer() { Text = "answer2", IsCorrect = false, Image = "url" } },
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
                {
                    winquestion
                }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var question = Substitute.For<SingleSelectImage>();
            _entityFactory.SingleSelectImageQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().SingleSelectImageQuestion(winquestion.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToSingleSelectImage()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectImage,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true, Image = "url" }, new WinAnswer() { Text = "answer2", IsCorrect = false, Image = "url" } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);

            var question = Substitute.For<SingleSelectImage>();
            _entityFactory.SingleSelectImageQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            question.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddSingleSelectImageToObjective()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectImage,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true, Image = "url" }, new WinAnswer() { Text = "answer2", IsCorrect = false, Image = "url" } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<SingleSelectImage>();
            _entityFactory.SingleSelectImageQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(question, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddAnswersToSingleSelectImage()
        {
            //Arrange
            var winAnswer1 = new WinAnswer() { IsCorrect = false, Image = "url1" };
            var winAnswer2 = new WinAnswer() { IsCorrect = false, Image = "url2" };
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectImage,
                Content = "content",
                Answers = new List<WinAnswer>() { winAnswer1, winAnswer2 },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<SingleSelectImage>();
            _entityFactory.SingleSelectImageQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);
            var answer1 = SingleSelectImageAnswerObjectMother.Create(winAnswer1.Image, _userName);
            var answer2 = SingleSelectImageAnswerObjectMother.Create(winAnswer2.Image, _userName);

            _entityFactory.SingleSelectImageAnswer(winAnswer1.Image, _userName).Returns(answer1);
            _entityFactory.SingleSelectImageAnswer(winAnswer2.Image, _userName).Returns(answer2);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            question.Received().AddAnswer(answer1, _userName);
            question.Received().AddAnswer(answer2, _userName);
        }

        [TestMethod]
        public void Import_ShouldSetCorrectAnswerFotSingleSelectImage()
        {
            //Arrange
            var winAnswer1 = new WinAnswer() { IsCorrect = true, Image = "url1" };
            var winAnswer2 = new WinAnswer() { IsCorrect = false, Image = "url2" };
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.SingleSelectImage,
                Content = "content",
                Answers = new List<WinAnswer>() { winAnswer1, winAnswer2 },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<SingleSelectImage>();
            _entityFactory.SingleSelectImageQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);
            var answer1 = SingleSelectImageAnswerObjectMother.Create(winAnswer1.Image, _userName);
            var answer2 = SingleSelectImageAnswerObjectMother.Create(winAnswer2.Image, _userName);

            _entityFactory.SingleSelectImageAnswer(winAnswer1.Image, _userName).Returns(answer1);
            _entityFactory.SingleSelectImageAnswer(winAnswer2.Image, _userName).Returns(answer2);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            question.Received().SetCorrectAnswer(answer1, _userName);
        }

        #endregion

        #region Hotspot

        [TestMethod]
        public void Import_ShouldCreateHotSpot()
        {
            //Arrange
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.HotSpot,
                Content = "content",
                HotspotPolygons = new List<WinHotspotPolygon>() { new WinHotspotPolygon() { Points = "[{x1:0,y1:0}]" }, new WinHotspotPolygon() { Points = "[{x1:2,y1:3}]" } },
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
                {
                    winquestion
                }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var question = Substitute.For<HotSpot>();
            _entityFactory.HotSpot(Arg.Any<string>(), Arg.Any<string>()).Returns(question);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().HotSpot(winquestion.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToHotspot()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.HotSpot,
                Content = "content",
                HotspotPolygons = new List<WinHotspotPolygon>() { new WinHotspotPolygon() { Points = "[{x1:0,y1:0}]" }, new WinHotspotPolygon() { Points = "[{x1:2,y1:3}]" } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective> { new WinObjective() { Title = "title", Questions = new List<WinQuestion>() { winquestion } } };

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<HotSpot>();
            _entityFactory.HotSpot(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            question.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddHotspotToObjective()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.HotSpot,
                Content = "content",
                HotspotPolygons = new List<WinHotspotPolygon>() { new WinHotspotPolygon() { Points = "[{x1:0,y1:0}]" }, new WinHotspotPolygon() { Points = "[{x1:2,y1:3}]" } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<HotSpot>();
            _entityFactory.HotSpot(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(question, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddAnswersToHotSpot()
        {
            //Arrange
            var winAnswer1 = new WinHotspotPolygon() { Points = "[{x1:0,y1:0}]" };
            var winAnswer2 = new WinHotspotPolygon() { Points = "[{x1:2,y1:3}]" };
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.HotSpot,
                Content = "content",
                HotspotPolygons = new List<WinHotspotPolygon>() { winAnswer1, winAnswer2 },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<HotSpot>();
            _entityFactory.HotSpot(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);
            var answer1 = Substitute.For<HotSpotPolygon>();
            var answer2 = Substitute.For<HotSpotPolygon>();

            _entityFactory.HotSpotPolygon(winAnswer1.Points, _userName).Returns(answer1);
            _entityFactory.HotSpotPolygon(winAnswer2.Points, _userName).Returns(answer2);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            question.Received().AddHotSpotPolygon(answer1, _userName);
            question.Received().AddHotSpotPolygon(answer2, _userName);
        }

        #endregion

        #region Statement

        [TestMethod]
        public void Import_ShouldCreateStatement()
        {
            //Arrange
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.Statement,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true }, new WinAnswer() { Text = "answer2", IsCorrect = false } },
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective> { new WinObjective() { Title = "title", Questions = new List<WinQuestion>() { winquestion } } };

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var question = Substitute.For<Statement>();
            _entityFactory.StatementQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().StatementQuestion(winquestion.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToStatement()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.Statement,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true }, new WinAnswer() { Text = "answer2", IsCorrect = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<Statement>();
            _entityFactory.StatementQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            question.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddStatementToObjective()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.Statement,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true }, new WinAnswer() { Text = "answer2", IsCorrect = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<Statement>();
            _entityFactory.StatementQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(question, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddAnswersToStatement()
        {
            //Arrange
            var winAnswer1 = new WinAnswer() { Text = "answer1", IsCorrect = true };
            var winAnswer2 = new WinAnswer() { Text = "answer2", IsCorrect = false };
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.Statement,
                Content = "content",
                Answers = new List<WinAnswer>() { winAnswer1, winAnswer2 },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<Statement>();
            _entityFactory.StatementQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);
            var answer1 = Substitute.For<Answer>();
            var answer2 = Substitute.For<Answer>();

            _entityFactory.Answer(winAnswer1.Text, winAnswer1.IsCorrect.Value, _userName).Returns(answer1);
            _entityFactory.Answer(winAnswer2.Text, winAnswer2.IsCorrect.Value, _userName).Returns(answer2);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            question.Received().AddAnswer(answer1, _userName);
            question.Received().AddAnswer(answer2, _userName);
        }

        #endregion

        #region OpenQuestion

        [TestMethod]
        public void Import_ShouldCreateOpenQuestion()
        {
            //Arrange
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.OpenQuestion,
                Content = "content",
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective> { new WinObjective() { Title = "title", Questions = new List<WinQuestion>() { winquestion } } };

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var question = Substitute.For<OpenQuestion>();
            _entityFactory.OpenQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().OpenQuestion(winquestion.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToOpenQuestion()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.OpenQuestion,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true }, new WinAnswer() { Text = "answer2", IsCorrect = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<OpenQuestion>();
            _entityFactory.OpenQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            question.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddOpenQuestionToObjective()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.OpenQuestion,
                Content = "content",
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<OpenQuestion>();
            _entityFactory.OpenQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(question, _userName);
        }

        #endregion

        #region TextMatching

        [TestMethod]
        public void Import_ShouldCreateTextMatching()
        {
            //Arrange
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.TextMatching,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Key = "key1", Value = "answer1" }, new WinAnswer() { Key = "key2", Value = "answer2" } },
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective> { new WinObjective() { Title = "title", Questions = new List<WinQuestion>() { winquestion } } };

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var question = Substitute.For<TextMatching>();
            _entityFactory.TextMatchingQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().TextMatchingQuestion(winquestion.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToTextMatching()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.TextMatching,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Key = "key1", Value = "answer1" }, new WinAnswer() { Key = "key2", Value = "answer2" } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<TextMatching>();
            _entityFactory.TextMatchingQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            question.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddTextMatchingToObjective()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.TextMatching,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Key = "key1", Value = "answer1" }, new WinAnswer() { Key = "key2", Value = "answer2" } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<TextMatching>();
            _entityFactory.TextMatchingQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(question, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddAnswersToTextMatching()
        {
            //Arrange
            var winAnswer1 = new WinAnswer() { Key = "key1", Value = "answer1" };
            var winAnswer2 = new WinAnswer() { Key = "key2", Value = "answer2" };
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.TextMatching,
                Content = "content",
                Answers = new List<WinAnswer>() { winAnswer1, winAnswer2 },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<TextMatching>();
            _entityFactory.TextMatchingQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);
            var answer1 = Substitute.For<TextMatchingAnswer>();
            var answer2 = Substitute.For<TextMatchingAnswer>();

            _entityFactory.TextMatchingAnswer(winAnswer1.Key, winAnswer1.Value, _userName).Returns(answer1);
            _entityFactory.TextMatchingAnswer(winAnswer2.Key, winAnswer2.Value, _userName).Returns(answer2);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            question.Received().AddAnswer(answer1, _userName);
            question.Received().AddAnswer(answer2, _userName);
        }

        #endregion

        #region FillInTheBlanks

        [TestMethod]
        public void Import_ShouldCreateFillInTheBlanks()
        {
            //Arrange
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.FillInTheBlanks,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true, GroupId = Guid.NewGuid(), MatchCase = false }, new WinAnswer() { Text = "answer2", IsCorrect = false, GroupId = Guid.NewGuid(), MatchCase = false } },
                LearningContents = new List<WinLearningContent>()
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>()
                {
                    winquestion
                }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);
            var question = Substitute.For<FillInTheBlanks>();
            _entityFactory.FillInTheBlanksQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);

            var blank = BlankAnswerObjectMother.Create();

            _entityFactory.BlankAnswer(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<Guid>(),
                Arg.Any<string>()).Returns(blank);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().FillInTheBlanksQuestion(winquestion.Title, _userName);
        }

        [TestMethod]
        public void Import_ShouldCreateAndAddLearningContentsToFillInTheBlanks()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.FillInTheBlanks,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true, GroupId = Guid.NewGuid(), MatchCase = false }, new WinAnswer() { Text = "answer2", IsCorrect = false, GroupId = Guid.NewGuid(), MatchCase = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<FillInTheBlanks>();
            _entityFactory.FillInTheBlanksQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            var blank = BlankAnswerObjectMother.Create();

            _entityFactory.BlankAnswer(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<Guid>(),
                Arg.Any<string>()).Returns(blank);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            _entityFactory.Received().LearningContent(winLearningContent.Text, _userName);
            question.Received().AddLearningContent(learningContent, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddFillInTheBlanksToObjective()
        {
            //Arrange
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.FillInTheBlanks,
                Content = "content",
                Answers = new List<WinAnswer>() { new WinAnswer() { Text = "answer1", IsCorrect = true, GroupId = Guid.NewGuid(), MatchCase = false }, new WinAnswer() { Text = "answer2", IsCorrect = false, GroupId = Guid.NewGuid(), MatchCase = false } },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<FillInTheBlanks>();
            _entityFactory.FillInTheBlanksQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);

            var blank = BlankAnswerObjectMother.Create();

            _entityFactory.BlankAnswer(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<Guid>(),
                Arg.Any<string>()).Returns(blank);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            section.Received().AddQuestion(question, _userName);
        }

        [TestMethod]
        public void Import_ShouldAddAnswersToFillInTheBlanks()
        {
            //Arrange
            var winAnswer1 = new WinAnswer() { Text = "answer2", IsCorrect = false, GroupId = Guid.NewGuid(), MatchCase = false };
            var winAnswer2 = new WinAnswer() { Text = "answer1", IsCorrect = true, GroupId = Guid.NewGuid(), MatchCase = false };
            var winLearningContent = new WinLearningContent() { Text = "some text <p>foo</p>" };
            var winquestion = new WinQuestion()
            {
                Title = "Information Content",
                Type = Question.QuestionTypes.FillInTheBlanks,
                Content = "content",
                Answers = new List<WinAnswer>() { winAnswer1, winAnswer2 },
                LearningContents = new List<WinLearningContent>() { winLearningContent }
            };
            var winCourse = Substitute.For<WinCourse>();
            winCourse.Title = "course title";
            winCourse.Objectives = new List<WinObjective>();
            winCourse.Objectives.Add(new WinObjective()
            {
                Title = "title",
                Questions = new List<WinQuestion>() { winquestion }
            });

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);
            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);


            var question = Substitute.For<FillInTheBlanks>();
            _entityFactory.FillInTheBlanksQuestion(Arg.Any<string>(), Arg.Any<string>()).Returns(question);
            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(winLearningContent.Text, _userName).Returns(learningContent);
            var answer1 = Substitute.For<BlankAnswer>();
            var answer2 = Substitute.For<BlankAnswer>();

            _entityFactory.BlankAnswer(winAnswer1.Text, winAnswer1.IsCorrect.Value, winAnswer1.MatchCase,
                winAnswer1.GroupId, _userName).Returns(answer1);
            _entityFactory.BlankAnswer(winAnswer2.Text, winAnswer2.IsCorrect.Value, winAnswer2.MatchCase,
                winAnswer2.GroupId, _userName).Returns(answer2);

            //Act
            _importer.Import(winCourse, _userName);

            //Assert
            question.Received().AddAnswer(answer1, _userName);
            question.Received().AddAnswer(answer2, _userName);
        }

        #endregion
    }
}
