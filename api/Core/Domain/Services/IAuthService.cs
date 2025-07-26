using System.Security.Claims;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;

namespace Xcianify.Core.Domain.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequestDto request);
        Task<AuthResponse> RefreshTokenAsync(TokenRequestDto request);
        Task<bool> RegisterAsync(RegisterRequestDto request);
        bool ValidateToken(string token);
        ClaimsPrincipal GetPrincipalFromToken(string token);
    }
}