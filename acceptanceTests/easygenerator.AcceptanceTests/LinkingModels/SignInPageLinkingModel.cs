using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class SignInPageLinkingModel : ILinkingModel
    {
        public string EmailInputField = "//input[contains(@class,'user-form-input') and contains(@name,'email')]";
        public string PasswordInputField = "//input[contains(@class,'user-form-input') and contains(@name,'password')]";

        public string SignInSubmitButton = "//input[contains(@type,'submit')]";
    }
}
