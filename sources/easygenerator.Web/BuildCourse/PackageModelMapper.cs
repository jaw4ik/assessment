using System;
using System.Linq;
using AutoMapper;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.BuildCourse
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
                .ForMember(dest => dest.HasContent, opt => opt.MapFrom(src => !String.IsNullOrEmpty(src.Content)))
                .ForMember(dest => dest.LearningContents, opt => opt.MapFrom(src => src.LearningContents.OrderBy(i => i.CreatedOn)));

            Mapper.CreateMap<Objective, ObjectivePackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToNString()))
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions.Where(question => question.Answers.Any())));

            Mapper.CreateMap<Course, CoursePackageModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToNString()))
                .ForMember(dest => dest.Objectives, opt => opt.MapFrom(src => src.RelatedObjectives.Where(objective => objective.Questions.Any(question => question.Answers.Any()))))
                .ForMember(dest => dest.HasIntroductionContent, opt => opt.MapFrom(src => !String.IsNullOrEmpty(src.IntroductionContent)));
        }

        public virtual CoursePackageModel MapCourse(Course course)
        {
            if (course == null)
                throw new ArgumentNullException();

            return Mapper.Map<CoursePackageModel>(course);
        }
    }
}