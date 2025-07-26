using Microsoft.AspNetCore.Builder;
using Xcianify.Presentation.Middleware;

namespace Xcianify.Presentation.Extensions
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}