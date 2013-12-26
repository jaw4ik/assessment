using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities
{
    public class UserSettings : Entity
    {
        public UserSettings() { }

        public UserSettings(string createBy, bool isShowIntroduction)
            : base(createBy)
        {
            IsShowIntroductionPage = isShowIntroduction;
        }

        public bool IsShowIntroductionPage { get; private set; }
        public User User { get; set; }

        public virtual void UpdateIsShowIntroduction(bool isShowIntroduction)
        {
            IsShowIntroductionPage = isShowIntroduction;
        }
    }
}
