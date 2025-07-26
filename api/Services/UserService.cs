using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.User;
using Xcianify.Core.Model;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Security;

namespace Xcianify.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher _passwordHasher;

        public UserService(
            IUserRepository userRepository,
            IMapper mapper,
            IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
        }

        public async Task<(IEnumerable<UserDto> Items, int TotalCount)> GetAllUsersAsync(UserFilterDto filterDto)
        {
            var (users, totalCount) = await _userRepository.GetAllAsync();
            return (_mapper.Map<IEnumerable<UserDto>>(users), totalCount);
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                throw new NotFoundException("User not found");

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetUserByUsernameAsync(string username)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null)
                throw new NotFoundException("User not found");

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
                throw new NotFoundException("User not found");

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto userDto)
        {
            // Check if username already exists
            var existingUser = await _userRepository.GetByUsernameAsync(userDto.Username);
            if (existingUser != null)
                throw new ValidationException("Username already exists");

            // Check if email already exists
            existingUser = await _userRepository.GetByEmailAsync(userDto.Email);
            if (existingUser != null)
                throw new ValidationException("Email already exists");

            // Hash the password
            var passwordHash = _passwordHasher.HashPassword(userDto.Password);

            var user = _mapper.Map<User>(userDto);
            user.PasswordHash = passwordHash;
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.IsActive = true;

            var createdUser = await _userRepository.AddAsync(user);
            return _mapper.Map<UserDto>(createdUser);
        }

        public async Task UpdateUserAsync(UpdateUserDto userDto)
        {
            var existingUser = await _userRepository.GetByIdAsync(userDto.Id);
            if (existingUser == null)
                throw new NotFoundException("User not found");

            // Check if email is being changed and already exists
            if (!string.Equals(existingUser.Email, userDto.Email, StringComparison.OrdinalIgnoreCase))
            {
                var emailExists = await _userRepository.GetByEmailAsync(userDto.Email);
                if (emailExists != null)
                    throw new ValidationException("Email already in use by another account");
            }

            _mapper.Map(userDto, existingUser);
            existingUser.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(existingUser);
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                throw new NotFoundException("User not found");

            await _userRepository.DeleteAsync(id);
        }

        public async Task<bool> CheckPasswordAsync(int userId, string password)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return false;

            return _passwordHasher.VerifyPassword(password, user.PasswordHash);
        }

        public async Task UpdatePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found");

            if (!_passwordHasher.VerifyPassword(currentPassword, user.PasswordHash))
                throw new ValidationException("Current password is incorrect");

            await UpdatePasswordInternal(user, newPassword);
        }

        public async Task ResetPasswordAsync(int userId, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found");

            await UpdatePasswordInternal(user, newPassword);
        }

        private async Task UpdatePasswordInternal(User user, string newPassword)
        {
            user.PasswordHash = _passwordHasher.HashPassword(newPassword);
            user.PasswordChangedAt = DateTime.UtcNow;
            user.FailedLoginAttempts = 0;
            user.LockedUntil = null;

            await _userRepository.UpdatePasswordAsync(user.Id, user.PasswordHash);
        }

        public async Task LockUserAccountAsync(int userId, int minutes)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found");

            user.LockedUntil = DateTime.UtcNow.AddMinutes(minutes);
            await _userRepository.UpdateLoginInfoAsync(user);
        }

        public async Task UnlockUserAccountAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found");

            user.LockedUntil = null;
            user.FailedLoginAttempts = 0;
            await _userRepository.UpdateLoginInfoAsync(user);
        }

        public async Task UpdateLastLoginAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return;

            user.LastLogin = DateTime.UtcNow;
            user.FailedLoginAttempts = 0;
            await _userRepository.UpdateLoginInfoAsync(user);
        }
    }
}
