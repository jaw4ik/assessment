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
        private const string CreateBy = "easygenerator@easygenerator.com";
        private const bool IsShowIntroductionPage = true;

        public static UserSettings CreateWithIsShowIntroductionPage(bool isShowIntroductionPage)
        {
            return Create(isShowIntroductionPage: isShowIntroductionPage);
        }

        public static UserSettings Create(string createBy = CreateBy, bool isShowIntroductionPage = IsShowIntroductionPage)
        {
            return new UserSettings(createBy, isShowIntroductionPage);
        }
    }
}
