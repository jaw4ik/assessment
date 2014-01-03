using System;
using System.Linq;
using AutoMapper;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildExperience.PackageModel;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.BuildExperience
{
    public class PackageModelMapper
    {
        public PackageModelMapper()
        {
            Mapper.CreateMap<Answer, AnswerOptionPackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToNString()));

            Mapper.CreateMap<LearningContent, LearningContentPackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToNString()));

            Mapper.CreateMap<Question, QuestionPackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToNString()))
                .ForMember(dest => dest.HasContent, opt => opt.MapFrom(src => !String.IsNullOrEmpty(src.Content)));

            Mapper.CreateMap<Objective, ObjectivePackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToNString()))
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions.Where(question => question.Answers.Any())));

            Mapper.CreateMap<Experience, ExperiencePackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToNString()))
                .ForMember(dest => dest.Objectives, opt => opt.MapFrom(src => src.RelatedObjectives.Where(objective => objective.Questions.Any(question => question.Answers.Any()))));
        }

        public virtual ExperiencePackageModel MapExperience(Experience experience)
        {
            if (experience == null)
                throw new ArgumentNullException();

            return Mapper.Map<ExperiencePackageModel>(experience);
        }
    }
}