using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Policy;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http.Routing;
using DocumentFormat.OpenXml.Math;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.PackageModel;
using HtmlAgilityPack;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.BuildCourse
{
    public class PackageMediaEquiper
    {
        private readonly CourseContentPathProvider _buildPathProvider;
        private readonly PhysicalFileManager _fileManager;
        private readonly ILog _logger;

        public PackageMediaEquiper(CourseContentPathProvider buildPathProvider, PhysicalFileManager fileManager, ILog logger)
        {
            _buildPathProvider = buildPathProvider;
            _fileManager = fileManager;
            _logger = logger;
        }
        public void EquipContentsMedia(string buildDirectory, CoursePackageModel coursePackageModel)
        {
            var folderForMedia = GetFolderForMedia(buildDirectory);

            IncludeCourseContentMediaToPackage(coursePackageModel, folderForMedia);
            IncludeManifestMediaToPackage(buildDirectory, folderForMedia);
        }

        private void IncludeManifestMediaToPackage(string buildDirectory, string folderForMedia)
        {
            var manifestFilePath = Path.Combine(buildDirectory, "manifest.json");
            if (!_fileManager.FileExists(manifestFilePath))
            {
                return;
            }

            var manifestData = _fileManager.ReadAllFromFile(manifestFilePath);
            var matches = Regex.Matches(manifestData, @"((http|ftp|https)*:*\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)", RegexOptions.IgnoreCase)
                               .Cast<Match>()
                               .Select(match => match.Value)
                               .Distinct()
                               .ToList();

            manifestData = matches.Aggregate(manifestData, (current, match) => current.Replace(match, ReplaceImage(match, folderForMedia)));
            _fileManager.WriteToFile(manifestFilePath, manifestData);
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
            section.ImageUrl = ReplaceImage(section.ImageUrl, folderForMedia);
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

            var imageSources = doc.DocumentNode.Descendants("img")
                .Select(img => img.Attributes["src"].Value)
                .ToArray();

            return imageSources.Aggregate(htmlContent, (current, imageSource) => current.Replace(imageSource, ReplaceImage(imageSource, folderForMedia)));
        }

        private string ReplaceImage(string imageUrl, string folderForMedia)
        {
            try
            {
                var newImagePath = GetNewImagePath(folderForMedia, imageUrl);
                DownloadImage(imageUrl, newImagePath);
                return GetNewImageWebPath(newImagePath);
            }
            catch (Exception e)
            {
                _logger.LogException(e);
                return imageUrl;
            }
        }

        private void DownloadImage(string imageUrl, string destinationPath)
        {
            using (WebClient client = new WebClient())
            {
                client.DownloadFile(CheckForProtocol(imageUrl), destinationPath);
            }
        }

        private string CheckForProtocol(string url)
        {
            return url.StartsWith("//") ? "http:" + url : url;
        }

        private string GetNewImagePath(string basePath, string imageUrl)
        {
            return Path.Combine(basePath, Guid.NewGuid().ToString() + Path.GetExtension(new Uri(imageUrl).AbsolutePath));
        }

        private string GetNewImageWebPath(string absoluteImageFilePath)
        {
            return Path.Combine(_buildPathProvider.GetIncludedMediaWebPath(), Path.GetFileName(absoluteImageFilePath)).Replace("\\", "/");
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