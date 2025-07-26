using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class OrganizationAccountService : IOrganizationAccountService
    {
        private readonly IOrganizationAccountRepository _organizationAccountRepository;
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IMapper _mapper;

        public OrganizationAccountService(
            IOrganizationAccountRepository organizationAccountRepository,
            IOrganizationRepository organizationRepository,
            IMapper mapper)
        {
            _organizationAccountRepository = organizationAccountRepository ?? throw new ArgumentNullException(nameof(organizationAccountRepository));
            _organizationRepository = organizationRepository ?? throw new ArgumentNullException(nameof(organizationRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<OrganizationAccountDto>> GetOrganizationAccountsAsync(int organizationId)
        {
            // Verify organization exists
            var organization = await _organizationRepository.GetByIdAsync(organizationId);
            if (organization == null)
            {
                throw new KeyNotFoundException($"Organization with ID {organizationId} not found.");
            }

            var accounts = await _organizationAccountRepository.GetByOrganizationIdAsync(organizationId);
            return _mapper.Map<IEnumerable<OrganizationAccountDto>>(accounts);
        }

        public async Task<OrganizationAccountDto> GetOrganizationAccountByIdAsync(int id)
        {
            var account = await _organizationAccountRepository.GetByIdAsync(id);
            if (account == null)
            {
                throw new KeyNotFoundException($"Organization account with ID {id} not found.");
            }
            return _mapper.Map<OrganizationAccountDto>(account);
        }

        public async Task<OrganizationAccountDto> CreateOrganizationAccountAsync(CreateOrganizationAccountDto dto)
        {
            // Verify organization exists
            var organization = await _organizationRepository.GetByIdAsync(dto.OrganizationId);
            if (organization == null)
            {
                throw new KeyNotFoundException($"Organization with ID {dto.OrganizationId} not found.");
            }

            // Check if account with same number already exists for this organization
            if (await _organizationAccountRepository.ExistsAsync(dto.OrganizationId, dto.AccountNumber))
            {
                throw new InvalidOperationException($"An account with number '{dto.AccountNumber}' already exists for this organization.");
            }

            var account = _mapper.Map<OrganizationAccount>(dto);
            account.CreatedAt = DateTime.UtcNow;
            account.UpdatedAt = DateTime.UtcNow;
            
            var createdAccount = await _organizationAccountRepository.CreateAsync(account);
            return _mapper.Map<OrganizationAccountDto>(createdAccount);
        }

        public async Task UpdateOrganizationAccountAsync(UpdateOrganizationAccountDto dto)
        {
            var existingAccount = await _organizationAccountRepository.GetByIdAsync(dto.Id);
            if (existingAccount == null)
            {
                throw new KeyNotFoundException($"Organization account with ID {dto.Id} not found.");
            }

            // If account number is being changed, check for duplicates
            if (existingAccount.AccountNumber != dto.AccountNumber && 
                await _organizationAccountRepository.ExistsAsync(existingAccount.OrganizationId, dto.AccountNumber, dto.Id))
            {
                throw new InvalidOperationException($"Another account with number '{dto.AccountNumber}' already exists for this organization.");
            }

            var account = _mapper.Map<OrganizationAccount>(dto);
            account.UpdatedAt = DateTime.UtcNow;
            
            await _organizationAccountRepository.UpdateAsync(account);
        }

        public async Task DeleteOrganizationAccountAsync(int id)
        {
            var existingAccount = await _organizationAccountRepository.GetByIdAsync(id);
            if (existingAccount == null)
            {
                throw new KeyNotFoundException($"Organization account with ID {id} not found.");
            }

            await _organizationAccountRepository.DeleteAsync(id);
        }
    }
}
