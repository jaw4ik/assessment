namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class MarkExamTemplateAsDeprecated : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.Templates SET IsDeprecated=1 WHERE Name = 'Exam'");
        }
        
        public override void Down()
        {
        }
    }
}
