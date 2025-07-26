using System;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class OrganizationService : IOrganizationService
    {
        private readonly IOrganizationRepository _organizationRepository;
        private readonly ILocationTypeRepository _locationTypeRepository;
        private readonly IMapper _mapper;

        public OrganizationService(
            IOrganizationRepository organizationRepository,
            ILocationTypeRepository locationTypeRepository,
            IMapper mapper)
        {
            _organizationRepository = organizationRepository ?? throw new ArgumentNullException(nameof(organizationRepository));
            _locationTypeRepository = locationTypeRepository ?? throw new ArgumentNullException(nameof(locationTypeRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<PaginatedOrganizationResultDto> GetOrganizationsAsync(OrganizationFilterDto filter)
        {
            var organizations = await _organizationRepository.GetAllAsync(filter);
            var totalCount = await _organizationRepository.GetCountAsync(filter);

            return new PaginatedOrganizationResultDto
            {
                Items = _mapper.Map<List<OrganizationDto>>(organizations),
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<OrganizationDto> GetOrganizationByIdAsync(int id)
        {
            var organization = await _organizationRepository.GetByIdAsync(id);
            if (organization == null)
            {
                throw new KeyNotFoundException($"Organization with ID {id} not found.");
            }
            return _mapper.Map<OrganizationDto>(organization);
        }

        public async Task<OrganizationDto> GetOrganizationByCodeAsync(string code)
        {
            var organization = await _organizationRepository.GetByCodeAsync(code);
            if (organization == null)
            {
                throw new KeyNotFoundException($"Organization with code '{code}' not found.");
            }
            return _mapper.Map<OrganizationDto>(organization);
        }

        public async Task<OrganizationDto> CreateOrganizationAsync(CreateOrganizationDto dto)
        {
            // Check if organization with same code already exists
            if (await _organizationRepository.ExistsAsync(dto.Code))
            {
                throw new InvalidOperationException($"An organization with code '{dto.Code}' already exists.");
            }

            // Validate location type exists
            var locationType = await _locationTypeRepository.GetByIdAsync(dto.LocationTypeId);
            if (locationType == null)
            {
                throw new KeyNotFoundException($"Location type with ID {dto.LocationTypeId} not found.");
            }

            var organization = _mapper.Map<Organization>(dto);
            organization.CreatedAt = DateTime.UtcNow;
            organization.UpdatedAt = DateTime.UtcNow;
            
            var createdOrganization = await _organizationRepository.CreateAsync(organization);
            return _mapper.Map<OrganizationDto>(createdOrganization);
        }

        public async Task UpdateOrganizationAsync(UpdateOrganizationDto dto)
        {
            var existingOrganization = await _organizationRepository.GetByIdAsync(dto.Id);
            if (existingOrganization == null)
            {
                throw new KeyNotFoundException($"Organization with ID {dto.Id} not found.");
            }

            // Check if another organization with the same code exists
            if (await _organizationRepository.ExistsAsync(dto.Code, dto.Id))
            {
                throw new InvalidOperationException($"Another organization with code '{dto.Code}' already exists.");
            }

            // Validate location type exists if it's being updated
            if (existingOrganization.LocationTypeId != dto.LocationTypeId)
            {
                var locationType = await _locationTypeRepository.GetByIdAsync(dto.LocationTypeId);
                if (locationType == null)
                {
                    throw new KeyNotFoundException($"Location type with ID {dto.LocationTypeId} not found.");
                }
            }

            var organization = _mapper.Map<Organization>(dto);
            organization.UpdatedAt = DateTime.UtcNow;
            
            await _organizationRepository.UpdateAsync(organization);
        }

        public async Task DeleteOrganizationAsync(int id)
        {
            var existingOrganization = await _organizationRepository.GetByIdAsync(id);
            if (existingOrganization == null)
            {
                throw new KeyNotFoundException($"Organization with ID {id} not found.");
            }

            await _organizationRepository.DeleteAsync(id);
        }
    }
}
