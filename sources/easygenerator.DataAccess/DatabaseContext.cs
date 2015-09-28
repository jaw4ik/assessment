using easygenerator.DataAccess.Migrations;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.ACL;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.DomainModel;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.Validation;
using System.Diagnostics;

namespace easygenerator.DataAccess
{
    public class DatabaseContext : DbContext, IDataContext, IUnitOfWork
    {
        private readonly IDomainEventPublisher _publisher;

        static DatabaseContext()
        {
            var _ = typeof(System.Data.Entity.SqlServer.SqlProviderServices);

            try
            {
                Database.SetInitializer(new MigrateDatabaseToLatestVersion<DatabaseContext, Configuration>());
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DatabaseContext()
            : this(null)
        {
        }

        public DatabaseContext(IDomainEventPublisher publisher)
            : base("DefaultConnection")
        {
            _publisher = publisher;
            ((IObjectContextAdapter)this).ObjectContext.ObjectMaterialized += (sender, args) => DateTimeObjectMaterializer.Materialize(args.Entity);
        }

        public DbSet<Objective> Objectives { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<LearningContent> LearningContents { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CourseCollaborator> CourseCollaborators { get; set; }
        public DbSet<Onboarding> Onboardings { get; set; }
        public DbSet<LearningPath> LearningPaths { get; set; }
        public DbSet<Company> Companies { get; set; }

        public IDbSet<T> GetSet<T>() where T : Identifiable
        {
            return Set<T>();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Properties<Guid>().Where(p => p.Name == "Id").Configure(p => p.IsKey());
            modelBuilder.Properties<DateTime>().Where(p => p.Name == "CreatedOn").Configure(p => p.IsRequired());
            modelBuilder.Properties<DateTime>().Where(p => p.Name == "ModifiedOn").Configure(p => p.IsRequired());
            modelBuilder.Properties<string>().Where(p => p.Name == "CreatedBy").Configure(p => p.IsRequired().HasMaxLength(254));
            modelBuilder.Properties<string>().Where(p => p.Name == "ModifiedBy").Configure(p => p.IsRequired().HasMaxLength(254));

            modelBuilder.Entity<LearningPath>().Property(e => e.CoursesOrder).IsOptional();
            modelBuilder.Entity<LearningPath>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<LearningPath>().HasMany(e => e.CoursesCollection).WithMany(e => e.LearningPathCollection).Map(m => m.ToTable("LearningPathCourses"));
            modelBuilder.Entity<LearningPath>().Property(e => e.PackageUrl).HasMaxLength(255);
            modelBuilder.Entity<LearningPath>().Property(e => e.PublicationUrl).HasMaxLength(255);

            modelBuilder.Entity<Objective>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Objective>().Property(e => e.ImageUrl).IsOptional();
            modelBuilder.Entity<Objective>().Property(e => e.QuestionsOrder).IsOptional();
            modelBuilder.Entity<Objective>().HasMany(e => e.QuestionsCollection).WithRequired(e => e.Objective);
            modelBuilder.Entity<Objective>().HasMany(e => e.RelatedCoursesCollection)
                .WithMany(e => e.RelatedObjectivesCollection)
                .Map(m => m.ToTable("CourseObjectives"));

            modelBuilder.Entity<Course>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Course>().HasRequired(e => e.Template).WithMany(e => e.Courses).WillCascadeOnDelete(false);
            modelBuilder.Entity<Course>().HasMany(e => e.RelatedObjectivesCollection).WithMany(e => e.RelatedCoursesCollection).Map(m => m.ToTable("CourseObjectives"));
            modelBuilder.Entity<Course>().HasMany(e => e.LearningPathCollection).WithMany(e => e.CoursesCollection).Map(m => m.ToTable("LearningPathCourses"));
            modelBuilder.Entity<Course>().HasMany(e => e.TemplateSettings).WithRequired(e => e.Course).WillCascadeOnDelete(true);
            modelBuilder.Entity<Course>().Property(e => e.IntroductionContent).IsMaxLength().IsOptional();
            modelBuilder.Entity<Course>().HasMany(e => e.CommentsCollection).WithRequired(e => e.Course).WillCascadeOnDelete(true);
            modelBuilder.Entity<Course>().Property(e => e.ObjectivesOrder).IsOptional();
            modelBuilder.Entity<Course>().HasMany(e => e.CollaboratorsCollection).WithRequired(e => e.Course).WillCascadeOnDelete(true);
            modelBuilder.Entity<Course>().Property(e => e.PackageUrl).HasMaxLength(255);
            modelBuilder.Entity<Course>().Property(e => e.ScormPackageUrl).HasMaxLength(255);
            modelBuilder.Entity<Course>().Property(e => e.PublicationUrl).HasMaxLength(255);
            modelBuilder.Entity<Course>().Property(e => e.IsPublishedToExternalLms);

            modelBuilder.Entity<CourseCollaborator>().HasRequired(e => e.Course);
            modelBuilder.Entity<CourseCollaborator>().Property(e => e.Email).IsRequired().HasMaxLength(254);

            modelBuilder.Entity<Aim4YouIntegration>().HasKey(e => new { e.Id });
            modelBuilder.Entity<Aim4YouIntegration>().Property(e => e.Aim4YouCourseId).IsRequired();
            modelBuilder.Entity<Aim4YouIntegration>().HasRequired(e => e.Course).WithOptional(c => c.Aim4YouIntegration).WillCascadeOnDelete(true);

            modelBuilder.Entity<CourseTemplateSettings>().Property(e => e.Settings);
            modelBuilder.Entity<CourseTemplateSettings>().Property(e => e.ExtraData).IsOptional();
            modelBuilder.Entity<CourseTemplateSettings>().HasRequired(e => e.Course).WithMany().HasForeignKey(p => p.Course_Id);
            modelBuilder.Entity<CourseTemplateSettings>().HasRequired(e => e.Template).WithMany().HasForeignKey(p => p.Template_Id);
            modelBuilder.Entity<CourseTemplateSettings>().Property(e => e.Course_Id)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName, new IndexAnnotation(new[] {
                    new IndexAttribute("IX_Course_Id"),
                    new IndexAttribute("UI_CourseTemplateSettings_Course_Id_Template_Id", 1) { IsUnique = true }
                }));
            modelBuilder.Entity<CourseTemplateSettings>().Property(e => e.Template_Id)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName, new IndexAnnotation(new[]{
                    new IndexAttribute("IX_Template_Id"),
                    new IndexAttribute("UI_CourseTemplateSettings_Course_Id_Template_Id", 2) { IsUnique = true }
                }));

            modelBuilder.Entity<Comment>().HasRequired(e => e.Course);
            modelBuilder.Entity<Comment>().Property(e => e.Text).IsRequired();

            modelBuilder.Entity<Question>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Question>().HasRequired(e => e.Objective);
            modelBuilder.Entity<Question>().HasMany(e => e.LearningContentsCollection).WithRequired(e => e.Question);
            modelBuilder.Entity<Question>().Property(e => e.Feedback.CorrectText).IsMaxLength().IsOptional();
            modelBuilder.Entity<Question>().Property(e => e.Feedback.IncorrectText).IsMaxLength().IsOptional();
            modelBuilder.Entity<Question>().Property(e => e.LearningContentsOrder).IsOptional();

            modelBuilder.Entity<Multipleselect>().HasMany(e => e.AnswersCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<QuestionWithBackground>().Property(e => e.Background).IsOptional();

            modelBuilder.Entity<DragAndDropText>().HasMany(e => e.DropspotsCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<Dropspot>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<Dropspot>().Property(e => e.X).IsRequired();
            modelBuilder.Entity<Dropspot>().Property(e => e.Y).IsRequired();
            modelBuilder.Entity<Dropspot>().HasRequired(e => e.Question);

            modelBuilder.Entity<HotSpot>().HasMany(e => e.HotSpotPolygonsCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<HotSpotPolygon>().Property(e => e.Points).IsRequired();
            modelBuilder.Entity<HotSpotPolygon>().HasRequired(e => e.Question);

            modelBuilder.Entity<TextMatching>().HasMany(e => e.AnswersCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<TextMatchingAnswer>().Property(e => e.Key).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<TextMatchingAnswer>().Property(e => e.Value).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<TextMatchingAnswer>().HasRequired(e => e.Question);

            modelBuilder.Entity<SingleSelectImage>().HasMany(e => e.AnswerCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<SingleSelectImageAnswer>().Property(e => e.Image).IsOptional();
            modelBuilder.Entity<SingleSelectImageAnswer>().Property(e => e.IsCorrect).IsRequired();
            modelBuilder.Entity<SingleSelectImageAnswer>().HasRequired(e => e.Question);

            modelBuilder.Entity<LearningContent>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<LearningContent>().HasRequired(e => e.Question);

            modelBuilder.Entity<Answer>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<Answer>().Property(e => e.IsCorrect).IsRequired();
            modelBuilder.Entity<Answer>().HasRequired(e => e.Question);

            modelBuilder.Entity<FillInTheBlanks>().HasMany(e => e.AnswersCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<BlankAnswer>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<BlankAnswer>().Property(e => e.IsCorrect).IsRequired();
            modelBuilder.Entity<BlankAnswer>().Property(e => e.GroupId).IsRequired();
            modelBuilder.Entity<BlankAnswer>().HasRequired(e => e.Question);

            modelBuilder.Entity<User>().Property(e => e.Email).IsRequired().HasMaxLength(254);
            modelBuilder.Entity<User>().Property(e => e.PasswordHash).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Phone).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.FirstName).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.LastName).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Country).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Role).IsOptional();
            modelBuilder.Entity<User>().Property(e => e.Organization).IsOptional();
            modelBuilder.Entity<User>().Property(e => e.LastReadReleaseNote).IsOptional().HasMaxLength(25);
            modelBuilder.Entity<User>().HasMany(e => e.PasswordRecoveryTicketCollection).WithRequired(e => e.User);
            modelBuilder.Entity<User>().HasOptional(e => e.Company).WithMany(e => e.Users).WillCascadeOnDelete(false);
            modelBuilder.Entity<User>().Map(e => e.ToTable("Users"));

            modelBuilder.Entity<PasswordRecoveryTicket>().HasRequired(e => e.User);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.CreatedBy);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.ModifiedBy);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.ModifiedOn);

            modelBuilder.Entity<Template>().Property(e => e.Name).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<Template>().Property(e => e.PreviewUrl).HasMaxLength(255);
            modelBuilder.Entity<Template>().Property(e => e.Order);
            modelBuilder.Entity<Template>().Property(e => e.IsNew);
            modelBuilder.Entity<Template>().Property(e => e.IsDeprecated);
            modelBuilder.Entity<Template>().HasMany(e => e.Courses);
            modelBuilder.Entity<Template>().HasMany(e => e.AccessControlList).WithRequired(e => e.Template).WillCascadeOnDelete(true);

            modelBuilder.Entity<TemplateAccessControlListEntry>().Property(e => e.UserIdentity).IsRequired().HasMaxLength(254);
            modelBuilder.Entity<TemplateAccessControlListEntry>().HasRequired(e => e.Template);

            modelBuilder.Entity<MailNotification>().Property(e => e.Body).IsRequired();
            modelBuilder.Entity<MailNotification>().Property(e => e.Subject).HasMaxLength(254).IsRequired();
            modelBuilder.Entity<MailNotification>().Property(e => e.ToEmailAddresses).HasMaxLength(511).IsRequired();
            modelBuilder.Entity<MailNotification>().Property(e => e.CCEmailAddresses).HasMaxLength(511);
            modelBuilder.Entity<MailNotification>().Property(e => e.BCCEmailAddresses).HasMaxLength(511);
            modelBuilder.Entity<MailNotification>().Property(e => e.FromEmailAddress).HasMaxLength(127).IsRequired();

            modelBuilder.Entity<HttpRequest>().Property(e => e.Url).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<HttpRequest>().Property(e => e.Verb).HasMaxLength(15).IsRequired();
            modelBuilder.Entity<HttpRequest>().Property(e => e.ServiceName).HasMaxLength(127).IsRequired();

            modelBuilder.Entity<ImageFile>().Property(e => e.Title).HasMaxLength(255).IsRequired();

            modelBuilder.Entity<Onboarding>().Property(e => e.CourseCreated).IsRequired();
            modelBuilder.Entity<Onboarding>().Property(e => e.ObjectiveCreated).IsRequired();
            modelBuilder.Entity<Onboarding>().Property(e => e.ContentCreated).IsRequired();
            modelBuilder.Entity<Onboarding>().Property(e => e.CreatedQuestionsCount).IsRequired();
            modelBuilder.Entity<Onboarding>().Property(e => e.CoursePublished).IsRequired();
            modelBuilder.Entity<Onboarding>().Property(e => e.IsClosed).IsRequired();
            modelBuilder.Entity<Onboarding>().Property(e => e.UserEmail).IsRequired().HasMaxLength(254).HasColumnAnnotation(IndexAnnotation.AnnotationName, new IndexAnnotation(new[]{
                    new IndexAttribute("Onboardings_UserEmail") { IsUnique = true}
              }));

            modelBuilder.Entity<DemoCourseInfo>().HasRequired(e => e.DemoCourse);
            modelBuilder.Entity<DemoCourseInfo>().HasOptional(e => e.SourceCourse);


            modelBuilder.Entity<CourseState>().HasRequired(e => e.Course).WithMany().HasForeignKey(e => e.Course_Id);

            modelBuilder.Entity<CourseState>().Property(e => e.Course_Id).HasColumnAnnotation(IndexAnnotation.AnnotationName, new IndexAnnotation(new[]{
                    new IndexAttribute("IX_Course_Id") { IsUnique = true}
              }));

            modelBuilder.Entity<ConsumerTool>().Property(e => e.Title).HasMaxLength(255);
            modelBuilder.Entity<ConsumerTool>().Property(e => e.Domain).HasMaxLength(255);
            modelBuilder.Entity<ConsumerTool>().Property(e => e.Key).IsRequired();
            modelBuilder.Entity<ConsumerTool>().Property(e => e.Secret).IsRequired();

            modelBuilder.Entity<LtiUserInfo>().HasKey(e => new { e.Id });
            modelBuilder.Entity<LtiUserInfo>().Property(e => e.LtiUserId).IsRequired();
            modelBuilder.Entity<LtiUserInfo>().HasRequired(e => e.User).WithOptional(c => c.LtiUserInfo).WillCascadeOnDelete(true);

            modelBuilder.Entity<Company>().Property(e => e.Name).IsRequired();
            modelBuilder.Entity<Company>().Property(e => e.LogoUrl).IsRequired();
            modelBuilder.Entity<Company>().Property(e => e.PublishCourseApiUrl).IsRequired();
            modelBuilder.Entity<Company>().Property(e => e.SecretKey).IsRequired();

            base.OnModelCreating(modelBuilder);
        }

        public void Save()
        {
            SaveChanges();

            foreach (DbEntityEntry entry in ChangeTracker.Entries<Entity>())
            {
                var entity = entry.Entity as Entity;

                if (entity == null || entity.Events == null)
                {
                    continue;
                }

                foreach (var @event in entity.Events)
                {
                    var method = typeof(IDomainEventPublisher).GetMethod("Publish").MakeGenericMethod(@event.GetType());
                    method.Invoke(_publisher, new object[] { @event });
                }
            }
        }

        public override int SaveChanges()
        {
            try
            {
                foreach (DbEntityEntry entry in ChangeTracker.Entries<Entity>())
                {
                    if ((entry.Entity is TextMatchingAnswer) && (entry.Entity as TextMatchingAnswer).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is SingleSelectImageAnswer) && (entry.Entity as SingleSelectImageAnswer).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is Dropspot) && (entry.Entity as Dropspot).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is HotSpotPolygon) && (entry.Entity as HotSpotPolygon).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is Answer) && (entry.Entity as Answer).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is BlankAnswer) && (entry.Entity as BlankAnswer).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is LearningContent) && (entry.Entity as LearningContent).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is Question) && (entry.Entity as Question).Objective == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is PasswordRecoveryTicket) && (entry.Entity as PasswordRecoveryTicket).User == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is CourseCollaborator) && (entry.Entity as CourseCollaborator).Course == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                }

                return base.SaveChanges();
            }
            catch (DbEntityValidationException exception)
            {
                foreach (var validationErrors in exception.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        Debug.WriteLine("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                    }
                }
                throw;
            }

        }
    }
}
