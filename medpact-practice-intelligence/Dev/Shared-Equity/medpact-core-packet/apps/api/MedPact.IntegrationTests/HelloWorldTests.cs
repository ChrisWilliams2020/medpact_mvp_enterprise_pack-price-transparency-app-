using Xunit;

public class HelloWorldTests
{
    [Fact]
    public void HelloWorld_ReturnsExpectedResult()
    {
        Assert.Equal("Hello, World!", "Hello, World!");
    }
}