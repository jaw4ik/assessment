using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Net;
using easygenerator.Web.BuildCourse.PackageModel;
using HtmlAgilityPack;

namespace easygenerator.Web.BuildCourse
{
    public class PackageMediaFetcher
    {
        private readonly CourseContentPathProvider _buildPathProvider;
        private readonly PhysicalFileManager _fileManager;
        private readonly ILog _logger;
        private readonly FileDownloader _fileDownloader;

        public PackageMediaFetcher(CourseContentPathProvider buildPathProvider, PhysicalFileManager fileManager, ILog logger, FileDownloader fileDownloader)
        {
            _buildPathProvider = buildPathProvider;
            _fileManager = fileManager;
            _logger = logger;
            _fileDownloader = fileDownloader;
        }

        public void AddMediaFromCourseModel(string buildDirectory, CoursePackageModel coursePackageModel)
        {
            var folderForMedia = GetFolderForMedia(buildDirectory);

            IncludeCourseContentMediaToPackage(coursePackageModel, folderForMedia);
        }

        public string AddMediaFromSettings(string buildDirectory, string settings) {
            var folderForMedia = GetFolderForMedia(buildDirectory);

            var matches = Regex.Matches(settings, @"((http|ftp|https)*:*\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)", RegexOptions.IgnoreCase | RegexOptions.Compiled)
                               .Cast<Match>()
                               .Select(match => match.Value)
                               .Distinct();

            return matches.Aggregate(settings, (current, match) => current.Replace(match, DownloadImage(match, folderForMedia)));
        }

        private void IncludeCourseContentMediaToPackage(CoursePackageModel course, string folderForMedia)
        {
            if (course.HasIntroductionContent)
            {
                course.IntroductionContent = ProcessHtmlContent(course.IntroductionContent, folderForMedia);
            }
            course.Sections.ForEach(section => ProcessSection(section, folderForMedia));
        }

        private void ProcessSection(SectionPackageModel section, string folderForMedia)
        {
            section.ImageUrl = DownloadImage(section.ImageUrl, folderForMedia);
            section.Questions.ForEach(question => ProcessQuestion(question, folderForMedia));
        }

        private void ProcessQuestion(QuestionPackageModel question, string folderForMedia)
        {
            if (question.HasContent)
            {
                question.Content = ProcessHtmlContent(question.Content, folderForMedia);
            }
            if (question.HasCorrectFeedback)
            {
                question.Feedback.CorrectText = ProcessHtmlContent(question.Feedback.CorrectText, folderForMedia);
            }
            if (question.HasIncorrectFeedback)
            {
                question.Feedback.IncorrectText = ProcessHtmlContent(question.Feedback.IncorrectText, folderForMedia);
            }
            question.LearningContents.ForEach(content => content.Text = ProcessHtmlContent(content.Text, folderForMedia));
        }

        private string ProcessHtmlContent(string htmlContent, string folderForMedia)
        {
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(htmlContent);

            var imagesReplacements = new Dictionary<string, string>();

            foreach (var imageElement in doc.DocumentNode.Descendants("img"))
            {
                var imageSource = imageElement.Attributes["src"].Value;
                if (!imagesReplacements.ContainsKey(imageSource))
                {
                    var newImageUrl = DownloadImage(imageSource, folderForMedia);
                    imageElement.Attributes["src"].Value = newImageUrl;
                    imagesReplacements[imageSource] = newImageUrl;
                }
                else
                {
                    imageElement.Attributes["src"].Value = imagesReplacements[imageSource];
                }
            }

            return doc.DocumentNode.OuterHtml;
        }

        private string DownloadImage(string imageUrl, string folderForMedia)
        {
            try
            {
                var newImagePath = _buildPathProvider.GetNewImagePath(folderForMedia, imageUrl);
                _fileDownloader.DownloadFile(imageUrl, newImagePath);
                return _buildPathProvider.GetNewImageWebPath(newImagePath);
            }
            catch (Exception e)
            {
                _logger.LogException(e);
                return imageUrl;
            }
        }

        private string GetFolderForMedia(string buildDirectory)
        {
            var folderForMedia = _buildPathProvider.GetIncludedMediaDirectoryPath(buildDirectory);

            if (!_fileManager.DirectoryExists(folderForMedia))
            {
                _fileManager.CreateDirectory(folderForMedia);
            }

            return folderForMedia;
        }
    }
}