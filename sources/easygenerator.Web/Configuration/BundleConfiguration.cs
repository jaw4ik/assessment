using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace easygenerator.Web.Configuration
{
    public static class BundleConfiguration
    {
        public static void Configure()
        {
            var bundles = BundleTable.Bundles;

            bundles.Add(new ScriptBundle("~/scripts/modernizr")
                            .Include("~/scripts/modernizr-{version}.js"));

            bundles.Add(new ScriptBundle("~/scripts/vendor")
                            .Include("~/scripts/jquery-{version}.js")
                            .Include("~/scripts/bootstrap.js")
                            .Include("~/scripts/knockout-{version}.js")
                            .Include("~/scripts/knockout.validation.js")
                            .Include("~/scripts/sammy-{version}.js")
                            .Include("~/scripts/q.js")
                            .Include("~/scripts/underscore.js"));

            bundles.Add(new StyleBundle("~/styles/css")
                            .Include("~/styles/bootstrap.css")
                            .Include("~/styles/bootstrap-responsive.css")
                            .Include("~/styles/font-awesome.css")
                            .Include("~/styles/durandal.css"));

            bundles.Add(new StyleBundle("~/css/css")
                            .Include("~/css/styles.css"));

        }
    }
}