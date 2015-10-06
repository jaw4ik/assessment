using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;

namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class RemoveExamTemplate : DbMigration
    {
        public override void Up()
        {
            Migration.Execute();

            Sql("DELETE FROM [dbo].[TemplateAccessControlListEntries] WHERE [Template_Id] = (SELECT [Id] FROM [dbo].[Templates] WHERE [Name] = 'Exam')");
            Sql("DELETE FROM [dbo].[Templates] WHERE [Name] = 'Exam'");
        }

        public override void Down()
        {
            Sql("INSERT INTO [dbo].[Templates] VALUES (NEWID(), 'Exam', '/Templates/Exam/', 'admin@easygenerator.com', GETDATE(), 'admin@easygenerator.com', GETDATE(), 3, 0, 1)");
            Sql("INSERT INTO [dbo].[TemplateAccessControlListEntries] VALUES (NEWID(), '*', (SELECT [Id] FROM [dbo].[Templates] WHERE [Name] = 'Exam'))");
        }
    }

    class Migration
    {
        public static void Execute()
        {
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                connection.Open();

                var examTemplateId = GetSingleField("SELECT [Id] FROM [dbo].[Templates] WHERE [Name] = 'Exam'", connection);
                var assessmentTemplateId = GetSingleField("SELECT [Id] FROM [dbo].[Templates] WHERE [Name] = 'Assessment'", connection);
                if (examTemplateId == null || assessmentTemplateId == null)
                {
                    return;
                }

                var courses = new List<CourseEntity>();

                SqlCommand command = new SqlCommand(String.Format("SELECT * FROM [dbo].[Courses] WHERE [Template_Id] = '{0}'", examTemplateId), connection);
                using (SqlDataReader courseReader = command.ExecuteReader())
                {
                    while (courseReader.Read())
                    {
                        var courseId = GetValue<Guid>("Id", courseReader);
                        var createdBy = GetValue<string>("CreatedBy", courseReader);

                        courses.Add(new CourseEntity() { Id = courseId, CreatedBy = createdBy });
                    }
                }

                for (var i = 0; i < courses.Count; i++)
                {
                    var course = courses[i];
                    bool settingsExists = false;
                    Guid? settingsFieldId = null;
                    string settingsFieldSettings = "";

                    SqlCommand getSettingsCommand = new SqlCommand(String.Format("SELECT * FROM [dbo].[CourseTemplateSettings] WHERE [Course_Id] = '{0}' AND [Template_Id] = '{1}'", course.Id, examTemplateId), connection);
                    using (SqlDataReader settingsReader = getSettingsCommand.ExecuteReader())
                    {
                        if (settingsReader.Read())
                        {
                            settingsExists = true;
                            settingsFieldId = GetValue<Guid>("Id", settingsReader);
                            settingsFieldSettings = GetValue<string>("Settings", settingsReader);
                        }
                    }

                    SqlCommand deleteAssessmentSettingsCommand = new SqlCommand(String.Format("DELETE FROM [dbo].[CourseTemplateSettings] WHERE [Course_Id] = '{0}' AND [Template_Id] = '{1}'", course.Id, assessmentTemplateId), connection);
                    deleteAssessmentSettingsCommand.ExecuteNonQuery();

                    if (settingsExists)
                    {
                        var processedJson = ProcessJson(settingsFieldSettings);

                        SqlCommand updateSettingsCommand = new SqlCommand(String.Format("UPDATE [dbo].[CourseTemplateSettings] SET [Settings] = '{0}', [Template_Id] = '{1}' WHERE [Id] = '{2}'", processedJson, assessmentTemplateId, settingsFieldId), connection);
                        updateSettingsCommand.ExecuteNonQuery();
                    }
                    else
                    {
                        var defaultSettings = "{\"assessmentMode\":\"exam\",\"xApi\":{\"enabled\":true,\"required\":false,\"selectedLrs\":\"default\",\"lrs\":{\"uri\":\"\",\"authenticationRequired\":false,\"credentials\":{\"username\":\"\",\"password\":\"\"}},\"allowedVerbs\":[\"started\",\"stopped\",\"experienced\",\"mastered\",\"answered\",\"passed\",\"failed\"]}}";
                        var createdOn = DateTime.Now;

                        SqlCommand insertSettingsCommand = new SqlCommand(String.Format("INSERT INTO [dbo].[CourseTemplateSettings]([Id],[Settings],[CreatedBy],[CreatedOn],[ModifiedBy],[ModifiedOn],[Template_Id],[Course_Id]) VALUES ('{0}', '{1}', '{2}', '{3}', '{2}', '{3}', '{4}', '{5}')",
                            Guid.NewGuid(), defaultSettings, course.CreatedBy, createdOn, assessmentTemplateId, course.Id), connection);
                        insertSettingsCommand.ExecuteNonQuery();
                    }

                    SqlCommand updateCourseCommand = new SqlCommand(String.Format("UPDATE [dbo].[Courses] SET [Template_Id] = '{0}' WHERE [Id] = '{1}'", assessmentTemplateId, course.Id), connection);
                    updateCourseCommand.ExecuteNonQuery();
                }
            }
        }

        private static string ProcessJson(string jsonData)
        {
            return jsonData.Insert(1, "\"assessmentMode\":\"exam\",");
        }

        private static object GetSingleField(string query, SqlConnection connection)
        {
            SqlCommand command = new SqlCommand(query, connection);

            using (SqlDataReader reader = command.ExecuteReader())
            {
                reader.Read();
                return reader.HasRows ? reader[0] : null;
            }
        }

        static T GetValue<T>(string columnName, SqlDataReader reader)
        {
            return (T)reader[GetColumnIndexByName(columnName, reader)];
        }

        static int GetColumnIndexByName(string columnName, SqlDataReader reader)
        {
            for (var i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i) == columnName)
                {
                    return i;
                }
            }
            return -1;
        }
    }

    class CourseEntity
    {
        public Guid Id { get; set; }
        public String CreatedBy { get; set; }
    }
}
