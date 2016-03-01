using easygenerator.Web.Components.BundleTransforms;
using System.Web.Optimization;

namespace easygenerator.Web.Configuration
{
    public static class BundleConfiguration
    {
        public static void Configure()
        {
            var bundles = BundleTable.Bundles;
            bundles.IgnoreList.Clear();
            bundles.IgnoreList.Ignore("*.spec.js");
            bundles.Add(new ScriptBundle("~/bundles/scripts/vendor")
                .Include("~/scripts/auth.js")
                .Include("~/scripts/jquery-{version}.js")
                .Include("~/scripts/jquery-ui-{version}.custom.js")
                .Include("~/scripts/jquery.signalR-{version}.js")
                .Include("~/scripts/knockout-{version}.js")
                .Include("~/scripts/knockout.validation.js")
                .Include("~/scripts/knockout-sortable.js")
                .Include("~/scripts/q.js")
                .Include("~/scripts/underscore.js")
                .Include("~/scripts/underscore.extensions.js")
                .Include("~/scripts/paper-full-{version}.js")
                .Include("~/scripts/jquery.form.js")
                .Include("~/scripts/jquery.extensions.js")
                .Include("~/scripts/jquery.autosize.js")
                .Include("~/scripts/md5.js")
                .Include("~/scripts/zeroclipboard.js")
                .Include("~/scripts/Blob.js")
                .Include("~/scripts/FileSaver.js")
                .IncludeDirectory("~/scripts/knockoutBindings", "*Binding.js")
            );

            bundles.Add(new Bundle("~/bundles/scripts/system").Include("~/scripts/vendor/system.js"));
            // This file is needed for IE, SystemJS load this file automatically when it needed
            bundles.Add(new Bundle("~/bundles/scripts/system-polyfills.js").Include("~/scripts/vendor/system-polyfills.js"));
            bundles.Add(new ScriptBundle("~/bundles/scripts/system-configuration")
                .Include("~/scripts/system-hooks.js")
                .Include("~/config.js")
            );

            //CKEditor.js doesn't pass javascript validation, because of that it can't be minified in vendor bundle
            //so we used already minified version in separate bundle
            bundles.Add(new Bundle("~/bundles/scripts/ckeditor").Include("~/scripts/ckeditor/ckeditor.js"));

            bundles.Add(new ScriptBundle("~/bundles/scripts/account")
                .Include("~/scripts/auth.js")
                .Include("~/scripts/jquery-{version}.js")
                .Include("~/scripts/knockout-{version}.js")
                .IncludeDirectory("~/scripts/account", "*.js")
                .IncludeDirectory("~/scripts/common", "*.js")
                .Include("~/scripts/underscore.js")
                .Include("~/scripts/underscore.extensions.js")
                .Include("~/scripts/knockoutBindings/selectBoxBinding.js")
                .Include("~/scripts/knockoutBindings/placeholderBinding.js")
            );

            bundles.Add(new ScriptBundle("~/bundles/scripts/review")
                .Include("~/scripts/jquery-{version}.js")
                .Include("~/scripts/knockout-{version}.js")
                .IncludeDirectory("~/scripts/review", "*.js")
                .IncludeDirectory("~/scripts/common", "*.js")
                .Include("~/scripts/underscore.js")
                .Include("~/scripts/underscore.extensions.js")
                .Include("~/scripts/knockoutBindings/slidingDialogBinding.js")
                .Include("~/scripts/knockoutBindings/placeholderBinding.js")
            );

            var stylesBundle = new StyleBundle("~/Content/css")
                .Include("~/Content/durandal.css")
                .Include("~/Content/common.css")
                .Include("~/Content/styles.css")
                .Include("~/Content/notifications.css")
                .Include("~/Content/question.css")
                .Include("~/Content/section.css")
                .Include("~/Content/courses.css")
                .Include("~/Content/course.css")
                .Include("~/Content/learningPaths.css")
                .Include("~/Content/collaboration.css")
                .Include("~/Scripts/ckeditor/Content.css")
                .Include("~/Content/ckeditor.css")
                .Include("~/Content/notify.css")
                .Include("~/Content/selectbox.css")
                .Include("~/Content/account.css")
                .Include("~/Content/reviewPanel.css")
                .Include("~/Content/dragAndDropText.css")
                .Include("~/Content/imagePreview.css")
                .Include("~/Content/singleSelectImage.css")
                .Include("~/Content/statement.css")
                .Include("~/Content/cssPreloaders.css")
                .Include("~/Content/navigationBar.css")
                .Include("~/Content/treeOfContent.css")
                .Include("~/Content/switchToggle.css")
                .Include("~/Content/onboarding.css")
                .Include("~/Content/hotSpot.css")
                .Include("~/Content/video.css")
                .Include("~/Content/publish.css")
                .Include("~/Content/dialogs.css")
                .Include("~/Content/library.css")
                .Include("~/Content/audio.css")
                .Include("~/Content/images.css")
                .Include("~/Content/notSupportedPage.css")
                .Include("~/Content/releaseNotes.css")
                .Include("~/Content/scenario.css")
                .Include("~/Content/wintoweb.css")
                .Include("~/Content/rankingText.css")
                .Include("~/Content/slider.css");

            stylesBundle.Transforms.Add(new ImageNoCacheParamTransform());
            bundles.Add(stylesBundle);

            bundles.Add(new StyleBundle("~/Content/reviewcss")
                .Include("~/Content/common.css")
                .Include("~/Content/styles.css")
                .Include("~/Content/review.css")
            );

            bundles.Add(new ScriptBundle("~/bundles/scripts/dashboard")
                .Include("~/scripts/jquery-{version}.js")
                .Include("~/scripts/jquery.unobtrusive-ajax.js")
            );

        }
    }
}