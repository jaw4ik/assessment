namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class MergeQuizAndExamToAssessment : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Templates", "IsDeprecated", c => c.Int(nullable: false));
            Sql("UPDATE dbo.Templates SET IsDeprecated=1 WHERE Name = 'Exam'");
            Sql("UPDATE dbo.Templates SET Name='Assessment', PreviewUrl='/Templates/Assessment/' WHERE Name = 'Quiz'");
        }
        
        public override void Down()
        {
            DropColumn("dbo.Templates", "IsDeprecated");
            Sql("UPDATE dbo.Templates SET Name='Quiz', PreviewUrl='/Templates/Quiz/' WHERE Name = 'Assessment'");
        }
    }
}
