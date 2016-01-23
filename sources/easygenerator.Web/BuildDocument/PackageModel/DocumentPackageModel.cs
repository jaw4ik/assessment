using System;
using easygenerator.DomainModel.Entities;
using Newtonsoft.Json;

namespace easygenerator.Web.BuildDocument.PackageModel
{
    public class DocumentPackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DocumentType DocumentType { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }

        [JsonIgnore]
        public string EmbedCode { get; set; }
    }
}