using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddingNewQuestionTypeFillInTheBlanks : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Answers", "Group", c => c.Guid(nullable: false, defaultValue: default(Guid)));
            AddColumn("dbo.Questions", "Type", c => c.Int(nullable: false, defaultValue: 0));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Questions", "Type");
            DropColumn("dbo.Answers", "Group");
        }
    }
}
