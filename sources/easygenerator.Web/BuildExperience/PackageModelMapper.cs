using System;
using System.Linq;
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

            Mapper.CreateMap<LearningObjectBuildModel, LearningObjectPackageModel>();

            Mapper.CreateMap<QuestionBuildModel, QuestionPackageModel>()
                .ForMember(dest => dest.LearningObjects, opt => opt.NullSubstitute(new List<LearningObjectPackageModel>()))
                .AfterMap((buildModel, packageModel) =>
                {
                    packageModel.Answers = buildModel.AnswerOptions != null
                        ? Mapper.Map<List<AnswerOptionPackageModel>>(buildModel.AnswerOptions)
                        : new List<AnswerOptionPackageModel>();
                });

            Mapper.CreateMap<ObjectiveBuildModel, ObjectivePackageModel>()
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(
                    src => src.Questions == null
                        ? new List<QuestionBuildModel>()
                        : src.Questions.Where(item => item.LearningObjects != null || item.AnswerOptions != null)));

            Mapper.CreateMap<ExperienceBuildModel, ExperiencePackageModel>()
                .ForMember(dest => dest.Objectives, opt => opt.MapFrom(src =>
                    src.Objectives == null
                        ? new List<ObjectiveBuildModel>()
                        : src.Objectives.Where(item => item.Questions != null && item.Questions.Count(q => q.LearningObjects != null || q.AnswerOptions != null) > 0)));
        }

        public virtual ExperiencePackageModel MapExperienceBuildModel(ExperienceBuildModel experienceBuildModel)
        {
            if (experienceBuildModel == null)
                throw new ArgumentNullException();

            return Mapper.Map<ExperiencePackageModel>(experienceBuildModel);
        }
    }
}