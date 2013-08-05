using System;
using System.Collections.Generic;
using AutoMapper;
using easygenerator.Web.BuildExperience.BuildModel;
using easygenerator.Web.BuildExperience.PackageModel;

namespace easygenerator.Web.BuildExperience
{
    public class PackageModelMapper
    {
        public PackageModelMapper()
        {
            Mapper.CreateMap<AnswerOptionBuildModel, AnswerOptionPackageModel>();
            Mapper.CreateMap<ExplanationBuildModel, ExplanationPackageModel>();
            Mapper.CreateMap<QuestionBuildModel, QuestionPackageModel>()
                .AfterMap((buildModel, packageModel) =>
                {
                    packageModel.Answers = Mapper.Map<List<AnswerOptionPackageModel>>(buildModel.AnswerOptions);
                });
            Mapper.CreateMap<ObjectiveBuildModel, ObjectivePackageModel>();
            Mapper.CreateMap<ExperienceBuildModel, ExperiencePackageModel>();
        }
        public virtual ExperiencePackageModel MapExperienceBuildModel(ExperienceBuildModel experienceBuildModel)
        {
            if (experienceBuildModel == null)
                throw new ArgumentNullException();

            return Mapper.Map<ExperiencePackageModel>(experienceBuildModel);
        }
    }
}