using easygenerator.DataAccess.Migrations;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.DomainModel;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;

namespace easygenerator.DataAccess
{
    public class DatabaseContext : DbContext, IDataContext, IUnitOfWork
    {
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
            : this("DefaultConnection")
        {
        }

        public DatabaseContext(string connectionString)
            : base(connectionString)
        {
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

        public IDbSet<T> GetSet<T>() where T : Entity
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


            modelBuilder.Entity<Objective>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Objective>().Property(e => e.QuestionsOrder).IsOptional();
            modelBuilder.Entity<Objective>().HasMany(e => e.QuestionsCollection).WithRequired(e => e.Objective);
            modelBuilder.Entity<Objective>().HasMany(e => e.RelatedCoursesCollection)
                .WithMany(e => e.RelatedObjectivesCollection)
                .Map(m => m.ToTable("CourseObjectives"));

            modelBuilder.Entity<Course>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Course>().HasRequired(e => e.Template).WithMany(e => e.Courses).WillCascadeOnDelete(false);
            modelBuilder.Entity<Course>().HasMany(e => e.RelatedObjectivesCollection).WithMany(e => e.RelatedCoursesCollection).Map(m => m.ToTable("CourseObjectives"));
            modelBuilder.Entity<Course>().HasMany(e => e.TemplateSettings).WithRequired(e => e.Course).WillCascadeOnDelete(true);
            modelBuilder.Entity<Course>().Property(e => e.IntroductionContent).IsMaxLength().IsOptional();
            modelBuilder.Entity<Course>().HasMany(e => e.CommentsCollection).WithRequired(e => e.Course).WillCascadeOnDelete(true);
            modelBuilder.Entity<Course>().Property(e => e.ObjectivesOrder).IsOptional();
            modelBuilder.Entity<Course>().HasMany(e => e.CollaboratorsCollection).WithRequired(e => e.Course).WillCascadeOnDelete(true);
            modelBuilder.Entity<Course>().Property(e => e.PackageUrl).HasMaxLength(255);
            modelBuilder.Entity<Course>().Property(e => e.ScormPackageUrl).HasMaxLength(255);
            modelBuilder.Entity<Course>().Property(e => e.PublicationUrl).HasMaxLength(255);

            modelBuilder.Entity<CourseCollaborator>().HasRequired(e => e.Course);
            modelBuilder.Entity<CourseCollaborator>().Property(e => e.Email).IsRequired().HasMaxLength(254);

            modelBuilder.Entity<Aim4YouIntegration>().HasKey(e => new { e.Id });
            modelBuilder.Entity<Aim4YouIntegration>().Property(e => e.Aim4YouCourseId).IsRequired();
            modelBuilder.Entity<Aim4YouIntegration>().HasRequired(e => e.Course).WithOptional(c => c.Aim4YouIntegration).WillCascadeOnDelete(true);

            modelBuilder.Entity<Course.CourseTemplateSettings>().Property(e => e.Settings);
            modelBuilder.Entity<Course.CourseTemplateSettings>().HasRequired(e => e.Course);
            modelBuilder.Entity<Course.CourseTemplateSettings>().HasRequired(e => e.Template);

            modelBuilder.Entity<Comment>().HasRequired(e => e.Course);
            modelBuilder.Entity<Comment>().Property(e => e.Text).IsRequired();

            modelBuilder.Entity<Question>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Question>().HasRequired(e => e.Objective);
            modelBuilder.Entity<Question>().HasMany(e => e.LearningContentsCollection).WithRequired(e => e.Question);
            modelBuilder.Entity<Question>().Property(e => e.Feedback.CorrectText).IsMaxLength().IsOptional();
            modelBuilder.Entity<Question>().Property(e => e.Feedback.IncorrectText).IsMaxLength().IsOptional();

            modelBuilder.Entity<Multipleselect>().HasMany(e => e.AnswersCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<DragAndDropText>().HasMany(e => e.DropspotsCollection).WithRequired(e => e.Question);
            
            modelBuilder.Entity<Dropspot>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<Dropspot>().Property(e => e.X).IsRequired();
            modelBuilder.Entity<Dropspot>().Property(e => e.Y).IsRequired();
            modelBuilder.Entity<Dropspot>().HasRequired(e => e.Question);

            modelBuilder.Entity<TextMatching>().HasMany(e => e.AnswersCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<TextMatchingAnswer>().Property(e => e.Key).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<TextMatchingAnswer>().Property(e => e.Value).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<TextMatchingAnswer>().HasRequired(e => e.Question);

            modelBuilder.Entity<SingleSelectImage>().HasMany(e => e.AnswerCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<SingleSelectImageAnswer>().Property(e => e.Image).IsRequired();
            modelBuilder.Entity<SingleSelectImageAnswer>().HasRequired(e => e.Question);

            modelBuilder.Entity<LearningContent>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<LearningContent>().HasRequired(e => e.Question);

            modelBuilder.Entity<Answer>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<Answer>().Property(e => e.IsCorrect).IsRequired();
            modelBuilder.Entity<Answer>().Property(e => e.Group).IsRequired();
            modelBuilder.Entity<Answer>().HasRequired(e => e.Question);

            modelBuilder.Entity<User>().Property(e => e.Email).IsRequired().HasMaxLength(254);
            modelBuilder.Entity<User>().Property(e => e.PasswordHash).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Phone).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.FirstName).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.LastName).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Country).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Organization).IsRequired();
            modelBuilder.Entity<User>().HasMany(e => e.PasswordRecoveryTicketCollection).WithRequired(e => e.User);
            modelBuilder.Entity<User>().Map(e => e.ToTable("Users"));

            modelBuilder.Entity<PasswordRecoveryTicket>().HasRequired(e => e.User);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.CreatedBy);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.ModifiedBy);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.ModifiedOn);

            modelBuilder.Entity<Template>().Property(e => e.Name).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<Template>().Property(e => e.Image).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<Template>().Property(e => e.Description).IsRequired();
            modelBuilder.Entity<Template>().Property(e => e.PreviewUrl).HasMaxLength(255);
            modelBuilder.Entity<Template>().Property(e => e.Order);
            modelBuilder.Entity<Template>().HasMany(e => e.Courses);

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

            base.OnModelCreating(modelBuilder);
        }

        public void Save()
        {
            SaveChanges();
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
                    if ((entry.Entity is Answer) && (entry.Entity as Answer).Question == null)
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
