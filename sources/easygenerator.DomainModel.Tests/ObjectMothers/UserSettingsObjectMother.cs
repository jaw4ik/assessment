using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class UserSettingsObjectMother
    {
        private const string LastReadReleaseNote = "";
        private const string LastPassedSurveyPopup = "";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static UserSettings Create(
            string createdBy = CreatedBy,
            string lastReadReleaseNote = LastReadReleaseNote,
            string lastPassedSurveyPopup = LastPassedSurveyPopup,
            bool? newEditor = null,
            bool isCreatedThroughLti = false, 
            bool isCreatedThroughSamlIdP = false,
            bool isNewEditorByDefault = true,
            bool includeMediaToPackage = false,
            bool? isSurvicateAnswered = null)
        {
            return new UserSettings(createdBy, lastReadReleaseNote, lastPassedSurveyPopup, isCreatedThroughLti, isCreatedThroughSamlIdP, newEditor, isNewEditorByDefault, includeMediaToPackage, isSurvicateAnswered);
        }
    }
}
