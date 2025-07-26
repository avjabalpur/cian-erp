using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Xcianify.Core.DTOs;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/auth")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto requestDto)
        {
            try
            {
                if (requestDto == null || string.IsNullOrEmpty(requestDto.Username) || string.IsNullOrEmpty(requestDto.Password))
                {
                    return BadRequest(new { message = "Username and password are required" });
                }

                var response = await _authService.LoginAsync(requestDto);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto requestDto)
        {
            try
            {
                if (requestDto == null)
                {
                    return BadRequest(new { message = "Invalid registration request" });
                }

                var result = await _authService.RegisterAsync(requestDto);
                if (result)
                {
                    return Ok(new { message = "Registration successful" });
                }
                return BadRequest(new { message = "Registration failed" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDto tokenRequestDto)
        {
            try
            {
                if (tokenRequestDto == null || string.IsNullOrEmpty(tokenRequestDto.Token) || string.IsNullOrEmpty(tokenRequestDto.RefreshToken))
                {
                    return BadRequest(new { message = "Token and refresh token are required" });
                }

                var response = await _authService.RefreshTokenAsync(tokenRequestDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        [HttpPost("validate-token")]
        public IActionResult ValidateToken([FromBody] TokenValidationRequestDto requestDto)
        {
            if (requestDto == null || string.IsNullOrEmpty(requestDto.Token))
            {
                return BadRequest(new { message = "Token is required" });
            }

            var isValid = _authService.ValidateToken(requestDto.Token);
            return Ok(new { isValid });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }
            return Ok(new { username });
        }
    }
}