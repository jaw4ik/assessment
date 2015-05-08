namespace easygenerator.Infrastructure
{
    public class BrokenRule
    {
        public BrokenRule(string field, string message)
        {
            Field = field;
            Message = message;
        }

        public string Field { get; set; }
        public string Message { get; set; }
    }
}
