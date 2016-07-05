using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace easygenerator.DomainModel
{
    public class EntityCloner : Cloner
    {
        protected static MethodInfo Guid_NewGuidMethodInfo = typeof(Guid).GetMethod("NewGuid");
        protected static FieldInfo DateTimeWrapper_NowPropertyInfo = typeof(DateTimeWrapper).GetField("Now");

        protected static MethodInfo EntityTypeCloner_UpdateLearningContentsOrderInQuestion =
           typeof(EntityCloner).GetMethod("UpdateLearningContentsOrderInQuestion",
               BindingFlags.NonPublic | BindingFlags.Instance);

        protected static MethodInfo EntityTypeCloner_UpdateQuestionsOrderInSection =
            typeof(EntityCloner).GetMethod("UpdateQuestionsOrderInSection", BindingFlags.NonPublic | BindingFlags.Instance);

        protected static MethodInfo EntityTypeCloner_UpdateSectionsOrderInCourse =
            typeof(EntityCloner).GetMethod("UpdateSectionsOrderInCourse", BindingFlags.NonPublic | BindingFlags.Instance);

        protected static MethodInfo EntityTypeCloner_UpdateAnswersOrderInQuestion =
            typeof(EntityCloner).GetMethod("UpdateAnswersOrderInQuestion", BindingFlags.NonPublic | BindingFlags.Instance);
        
        public override T Clone<T>(T obj, params object[] args)
        {
            if (obj is Entity)
            {
                if (args.Length == 0 || !(args[0] is string))
                {
                    throw new ArgumentException("For Entity type owner name has to be passed as first element of args and should be string.", "args");
                }
            }
            return base.Clone(obj, args);
        }

        protected override List<Expression> GetCustomCloneExpressions(Type type, Expression target, Expression cloned, Expression source, Expression args)
        {
            if (typeof(Entity).IsAssignableFrom(type))
            {
                var list = new List<Expression>
                {
                    Expression.Assign(target, Expression.New(type)),
                    Expression.Call(cloned, Methods.ClonedDic_Add, source, target)
                };

                foreach (var propertyInfo in type.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance))
                {
                    PropertyInfo member = null;
                    // workaround for private fields in base classes
                    if (!propertyInfo.CanWrite && propertyInfo.DeclaringType != type)
                    {
                        member = propertyInfo.DeclaringType.GetProperty(propertyInfo.Name,
                            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
                    }
                    else
                    {
                        member = propertyInfo;
                    }

                    if (type == typeof(Course) || type == typeof(CourseTemplateSettings))
                    {
                        if (member.Name == "Template")
                        {
                            list.Add(Expression.Assign(Expression.Property(target, member), Expression.Property(source, member)));
                            continue;
                        }
                    }

                    if (type == typeof(Course))
                    {
                        if (member.Name == "BuildOn" || member.Name == "PackageUrl" || member.Name == "PublishedOn" || member.Name == "ScormPackageUrl" || member.Name == "PublicationUrl"
                            || member.Name == "CommentsCollection" || member.Name == "CollaboratorsCollection" || member.Name == "LearningPathCollection" || member.Name == "CourseCompanies")
                        {
                            continue;
                        }

                        if (member.Name == "TemplateSettings")
                        {
                            list.Add(
                            Expression.IfThen(
                                Expression.AndAlso(
                                    Expression.GreaterThan(Expression.Property(args, "Length"), Expression.Constant(1)),
                                    Expression.Convert(Expression.ArrayAccess(args, Expression.Constant(1)),
                                        typeof(bool))
                                    ), GetPropertyCopyExpression(member, source, target, cloned, args)));

                            continue;
                        }

                        if (member.Name == "CreatedOn")
                        {
                            list.Add(Expression.Assign(Expression.Property(target, member), Expression.Invoke(Expression.Field(null, DateTimeWrapper_NowPropertyInfo))));
                            continue;
                        }

                        if (member.Name == "SaleInfo")
                        {
                            list.Add(Expression.Assign(Expression.Property(target, member), Expression.New(typeof(CourseSaleInfo))));
                            continue;
                        }
                    }

                    // cloning of cources is not needed.
                    if (type == typeof(Section) && member.Name == "RelatedCoursesCollection")
                        continue;

                    if (!member.CanRead || !member.CanWrite || member.GetIndexParameters().Length > 0)
                        continue;

                    if (member.Name == "Id")
                    {
                        list.Add(Expression.Assign(Expression.Property(target, member), Expression.Call(null, Guid_NewGuidMethodInfo)));
                    }
                    else if (member.Name == "ModifiedOn")
                    {
                        list.Add(Expression.Assign(Expression.Property(target, member), Expression.Invoke(Expression.Field(null, DateTimeWrapper_NowPropertyInfo))));
                    }
                    else if (member.Name == "CreatedBy" || member.Name == "ModifiedBy")
                    {
                        list.Add(Expression.Assign(Expression.Property(target, member),
                            Expression.Convert(Expression.ArrayAccess(args, Expression.Constant(0)), typeof(string))));
                    }
                    else
                    {
                        list.Add(GetPropertyCopyExpression(member, source, target, cloned, args));
                    }
                }

                if (typeof(Question).IsAssignableFrom(type))
                {
                    list.Add(Expression.Call(Expression.Constant(this), EntityTypeCloner_UpdateLearningContentsOrderInQuestion, source, target));
                }

                if (typeof(RankingText).IsAssignableFrom(type))
                {
                    list.Add(Expression.Call(Expression.Constant(this), EntityTypeCloner_UpdateAnswersOrderInQuestion, source, target));
                }

                if (type == typeof(Section))
                {
                    list.Add(Expression.Call(Expression.Constant(this), EntityTypeCloner_UpdateQuestionsOrderInSection, source, target));
                }

                if (type == typeof(Course))
                {
                    list.Add(Expression.Call(Expression.Constant(this), EntityTypeCloner_UpdateSectionsOrderInCourse, source, target));
                }
                
                return list;
            }
            return null;
        }

        protected virtual void UpdateSectionsOrderInCourse(Course source, Course target)
        {
            var orderedClonedSections = source.OrderClonedSections(target.RelatedSectionsCollection);
            target.UpdateSectionsOrder(orderedClonedSections, target.CreatedBy);
        }

        protected virtual void UpdateQuestionsOrderInSection(Section source, Section target)
        {
            var orderedClonedQuestions = source.OrderClonedQuestions(target.QuestionsCollection);
            target.UpdateQuestionsOrder(orderedClonedQuestions, target.CreatedBy);
        }

        protected virtual void UpdateLearningContentsOrderInQuestion(Question source, Question target)
        {
            var orderedClonedLearningContents = source.OrderClonedLearningContents(target.LearningContentsCollection);
            target.UpdateLearningContentsOrder(orderedClonedLearningContents, target.CreatedBy);
        }

        protected virtual void UpdateAnswersOrderInQuestion(RankingText source, RankingText target)
        {
            var orderedClonedAnswers = source.OrderClonedAnswers(target.AnswersCollection);
            target.UpdateAnswersOrder(orderedClonedAnswers, target.CreatedBy);
        }
    }
}
