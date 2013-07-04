using easygenerator.AcceptanceTests.Helpers;
using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class QuestionsList : BasePageElement<QuestionsListLinkingModel>
    {
        public QuestionsList() { }

        public QuestionsListItem[] Items { get; set; }

        public Order Order { get; set; }
    }
}
