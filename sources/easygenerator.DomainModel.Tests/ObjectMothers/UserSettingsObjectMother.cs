using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class UserSettingsObjectMother
    {
        private const string LastReadReleaseNote = "";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static UserSettings Create(
            string createdBy = CreatedBy,
            string lastReadReleaseNote = LastReadReleaseNote,
            bool? newEditor = null,
            bool isCreatedThroughLti = false, 
            bool isNewEditorByDefault = true)
        {
            return new UserSettings(createdBy, lastReadReleaseNote, isCreatedThroughLti, newEditor, isNewEditorByDefault);
        }
    }
}
