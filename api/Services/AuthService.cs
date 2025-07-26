using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Xcianify.Core.Configuration;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.Model;
using Xcianify.Core.Security;

namespace Xcianify.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtConfig _jwtConfig;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ILogger<AuthService> _logger;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IRoleRepository _roleRepository;

        public AuthService(
            IUserRepository userRepository, 
            IOptions<JwtConfig> jwtConfig, 
            IPasswordHasher passwordHasher, 
            ILogger<AuthService> logger, 
            IUserRoleRepository userRoleRepository, 
            IRoleRepository roleRepository)
        {
            _userRepository = userRepository;
            _jwtConfig = jwtConfig.Value;
            _passwordHasher = passwordHasher;
            _logger = logger;
            _userRoleRepository = userRoleRepository;
            _roleRepository = roleRepository;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequestDto request)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);

            if (user == null)
            {
                _logger.LogWarning("Login attempt failed: User not found for username {Username}", request.Username);
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                _logger.LogWarning("Login attempt failed: User {Username} has no password hash", request.Username);
                throw new UnauthorizedAccessException("Invalid user account");
            }

            if (!user.IsActive)
            {
                _logger.LogWarning("Login attempt failed: User {Username} is not active", request.Username);
                throw new UnauthorizedAccessException("Account is not active");
            }

            if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                _logger.LogWarning("Login attempt failed: Invalid password for username {Username}", request.Username);
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            // Update last login
            user.LastLogin = DateTime.UtcNow;
            user.FailedLoginAttempts = 0;
            await _userRepository.UpdateLoginInfoAsync(user);

            _logger.LogInformation("User {Username} logged in successfully", request.Username);

            var userRoles = await _userRoleRepository.GetByUserIdAsync(user.Id);
            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userRepository.UpdateAsync(user);
            var allRoles = await _roleRepository.GetAllAsync();
            var roleList = new List<Role>();
            foreach (var role in userRoles) {
                var ro = allRoles.Items.FirstOrDefault(x => x.Id == role.Id);
                if (ro != null) {
                    roleList.Add(ro);
                }
            }
            
            return new AuthResponse
            {
                Token = GenerateJwtToken(user, roleList.Select(x=>x.Name)),
                RefreshToken = refreshToken,
                Username = user.Username,
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roleList.Select(x => x.Name).ToList(),
                Department = "test",
                Designation = user.Designation
            };
        }

        public async Task<bool> RegisterAsync(RegisterRequestDto request)
        {
            var existingUsername = await _userRepository.GetByUsernameAsync(request.Username);
            var existingEmail = await _userRepository.GetByEmailAsync(request.Email);

            if (existingUsername != null)
            {
                throw new InvalidOperationException("Username already exists");
            }
            if (existingEmail != null)
            {
                throw new InvalidOperationException("Email already exists");
            }

            var user = new User
            {
                Username = request.Username,
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                IsActive = true,
                IsEmailVerified = false,
                IsPhoneVerified = false,
                FailedLoginAttempts = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = 1, // System user for now
                UpdatedBy = 1
            };

            var createdUser = await _userRepository.AddAsync(user);

            _logger.LogInformation("User {Username} registered successfully", request.Username);
            return createdUser != null;
        }

        public async Task<AuthResponse> RefreshTokenAsync(TokenRequestDto tokenRequestDto)
        {
            var principal = GetPrincipalFromToken(tokenRequestDto.Token);
            if (principal == null)
            {
                throw new SecurityTokenException("Invalid token");
            }
            var username = principal.Identity.Name;

            var user = await _userRepository.GetByUsernameAsync(username);

            if (user == null || user.RefreshToken != tokenRequestDto.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new SecurityTokenException("Invalid refresh token");
            }

            var userRoles = await _userRoleRepository.GetByUserIdAsync(user.Id);

            var allRoles = await _roleRepository.GetAllAsync();
            var roleList = new List<Role>();
            foreach (var role in userRoles)
            {
                var ro = allRoles.Items.FirstOrDefault(x => x.Id == role.Id);
                if (ro != null)
                {
                    roleList.Add(ro);
                }
            }

            var newJwtToken = GenerateJwtToken(user, roleList.Select(x => x.Name));
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userRepository.UpdateAsync(user);

            return new AuthResponse
            {
                Token = newJwtToken,
                RefreshToken = newRefreshToken,
                Username = user.Username,
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roleList.Select(x => x.Name).ToList(),
                Department = "test",
                Designation = user.Designation
            };
        }

        public bool ValidateToken(string token)
        {
            try
            {
                var principal = GetPrincipalFromToken(token);
                return principal != null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Token validation failed");
                return false;
            }
        }

        public ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidAudience = _jwtConfig.Audience,
                ValidateIssuer = true,
                ValidIssuer = _jwtConfig.Issuer,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key)),
                ValidateLifetime = false // We don't care if the token is expired, we're just getting the principal
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }

        private string GenerateJwtToken(User user, IEnumerable<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_jwtConfig.DurationInMinutes);

            var token = new JwtSecurityToken(
                _jwtConfig.Issuer,
                _jwtConfig.Audience,
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}