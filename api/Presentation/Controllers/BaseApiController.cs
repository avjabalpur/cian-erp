using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Xcianify.Presentation.Controllers
{
    [ApiController]
    [Authorize]
    public abstract class BaseApiController : ControllerBase
    {
        protected int CurrentUserId
        {
            get
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (int.TryParse(userIdClaim, out int userId))
                {
                    return userId;
                }
                return 0;
            }
        }

        protected string CurrentUserEmail => User.FindFirst("email")?.Value ?? string.Empty;
        protected string CurrentUserName => User.FindFirst("name")?.Value ?? string.Empty;
        
      
    }
}
