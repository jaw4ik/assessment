using System;
using System.Linq;
using System.Collections.Generic;
using AutoMapper;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildExperience.PackageModel;

namespace easygenerator.Web.BuildExperience
{
    public class PackageModelMapper
    {
        public PackageModelMapper()
        {
            Mapper.CreateMap<Answer, AnswerOptionPackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString("N")));

            Mapper.CreateMap<LearningObject, LearningObjectPackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString("N")));

            Mapper.CreateMap<Question, QuestionPackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString("N")))
                .AfterMap((buildModel, packageModel) =>
                {
                    packageModel.Answers = buildModel.Answers != null
                        ? Mapper.Map<List<AnswerOptionPackageModel>>(buildModel.Answers)
                        : new List<AnswerOptionPackageModel>();

                    packageModel.LearningObjects = buildModel.LearningObjects != null
                        ? Mapper.Map<List<LearningObjectPackageModel>>(buildModel.LearningObjects)
                        : new List<LearningObjectPackageModel>();
                });

            Mapper.CreateMap<Objective, ObjectivePackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString("N")))
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(
                    src => src.Questions == null
                        ? new List<Question>()
                        : src.Questions.Where(item => item.LearningObjects != null || item.Answers != null)));

            Mapper.CreateMap<Experience, ExperiencePackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString("N")))
                .ForMember(dest => dest.Objectives, opt => opt.MapFrom(src =>
                    src.RelatedObjectives == null
                        ? new List<ObjectivePackageModel>()
                        : Mapper.Map<List<ObjectivePackageModel>>(src.RelatedObjectives.Where(item => item.Questions != null && item.Questions.Count(q => q.LearningObjects != null || q.Answers != null) > 0))));
        }

        public virtual ExperiencePackageModel MapExperience(Experience experience)
        {
            if (experience == null)
                throw new ArgumentNullException();

            return Mapper.Map<ExperiencePackageModel>(experience);
        }
    }
}