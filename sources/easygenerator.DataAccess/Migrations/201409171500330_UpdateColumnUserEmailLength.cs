namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class UpdateColumnUserEmailLength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Onboardings", "UserEmail", c => c.String(nullable: false, maxLength: 254));

            Sql("INSERT INTO dbo.OnBoardings (Id, CourseCreated, ObjectiveCreated, ContentCreated, CreatedQuestionsCount, CoursePublished, IsClosed, UserEmail)" +
                           " SELECT NEWID(), 1, 1, 1, 3, 1, 1, Email FROM dbo.Users");
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Onboardings", "UserEmail", c => c.String(nullable: false));
        }
    }
}
