namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class UpdateSimpleCourseTemplateTexts : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.Templates SET Description='This template is a basic course format.' WHERE Name='Simple course'");
        }

        public override void Down()
        {
            Sql("UPDATE dbo.Templates SET Description='Use this when you want a course style like setup.' WHERE Name='Simple course'");
        }
    }
}
