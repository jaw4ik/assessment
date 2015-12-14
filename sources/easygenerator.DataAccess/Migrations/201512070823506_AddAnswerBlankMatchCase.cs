namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAnswerBlankMatchCase : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BlankAnswers", "MatchCase", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.BlankAnswers", "MatchCase");
        }
    }
}
