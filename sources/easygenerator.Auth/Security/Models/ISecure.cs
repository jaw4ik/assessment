namespace easygenerator.Auth.Security.Models
{
    public interface ISecure<out T>
    {
        T GetObject();
    }
}