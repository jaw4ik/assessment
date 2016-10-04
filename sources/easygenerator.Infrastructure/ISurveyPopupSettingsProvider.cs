using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Infrastructure
{
    public interface ISurveyPopupSettingsProvider
    {
        string SurveyPopupVersion { get; }
        string SurveyPopupPageUrl { get; }
        string SurveyPopupOriginUrl { get; }
        int SurveyPopupNumberOfDaysUntilShowUp { get; }
    }
}
