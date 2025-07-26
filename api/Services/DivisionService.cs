using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.Division;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class DivisionService : IDivisionService
    {
        private readonly IDivisionRepository _divisionRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IMapper _mapper;

        public DivisionService(
            IDivisionRepository divisionRepository,
            IDepartmentRepository departmentRepository,
            IMapper mapper)
        {
            _divisionRepository = divisionRepository ?? throw new ArgumentNullException(nameof(divisionRepository));
            _departmentRepository = departmentRepository ?? throw new ArgumentNullException(nameof(departmentRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<DivisionDto> GetByIdAsync(int id)
        {
            var division = await _divisionRepository.GetByIdAsync(id);
            if (division == null)
                throw new NotFoundException("Division not found");

            return MapToDto(division);
        }

        public async Task<DivisionDto> GetByCodeAsync(string code)
        {
            var division = await _divisionRepository.GetByCodeAsync(code);
            if (division == null)
                throw new NotFoundException("Division not found");

            return MapToDto(division);
        }

        public async Task<IEnumerable<DivisionDto>> GetAllAsync()
        {
            var divisions = await _divisionRepository.GetAllAsync();
            return MapToDtoList(divisions);
        }

        public async Task<IEnumerable<DivisionDto>> GetByDepartmentIdAsync(int departmentId)
        {
            // Verify department exists
            var department = await _departmentRepository.GetByIdAsync(departmentId);
            if (department == null)
                throw new NotFoundException("Department not found");

            var divisions = await _divisionRepository.GetByDepartmentIdAsync(departmentId);
            return MapToDtoList(divisions);
        }

        public async Task<DivisionDto> CreateAsync(CreateDivisionDto createDto, int userId)
        {
            // Check if division code already exists
            if (await _divisionRepository.CodeExistsAsync(createDto.Code))
            {
                throw new ValidationException("A division with this code already exists.");
            }

            // If department ID is provided, verify it exists
            if (createDto.DepartmentId.HasValue)
            {
                var department = await _departmentRepository.GetByIdAsync(createDto.DepartmentId.Value);
                if (department == null)
                    throw new ValidationException("Department not found");
            }

            var division = _mapper.Map<Division>(createDto);
            division.CreatedBy = userId;
            division.UpdatedBy = userId;
            division.CreatedAt = DateTime.UtcNow;
            division.UpdatedAt = DateTime.UtcNow;

            var id = await _divisionRepository.CreateAsync(division);
            return await GetByIdAsync(id);
        }

        public async Task<DivisionDto> UpdateAsync(int id, UpdateDivisionDto updateDto, int userId)
        {
            // Check if division exists
            var existingDivision = await _divisionRepository.GetByIdAsync(id);
            if (existingDivision == null)
                throw new NotFoundException("Division not found");

            // Check if the new code is already taken by another division
            if (updateDto.Code != existingDivision.Code && 
                await _divisionRepository.CodeExistsAsync(updateDto.Code, id))
            {
                throw new ValidationException("A division with this code already exists.");
            }

            // If department ID is provided, verify it exists
            if (updateDto.DepartmentId.HasValue && 
                updateDto.DepartmentId != existingDivision.DepartmentId)
            {
                var department = await _departmentRepository.GetByIdAsync(updateDto.DepartmentId.Value);
                if (department == null)
                    throw new ValidationException("Department not found");
            }

            // Map the DTO to the existing division
            _mapper.Map(updateDto, existingDivision);
            existingDivision.UpdatedBy = userId;
            existingDivision.UpdatedAt = DateTime.UtcNow;

            // Update the division
            var success = await _divisionRepository.UpdateAsync(existingDivision);
            if (!success)
                throw new ApplicationException("Failed to update division");

            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // Check if division exists
            var existingDivision = await _divisionRepository.GetByIdAsync(id);
            if (existingDivision == null)
                throw new NotFoundException("Division not found");

            // Delete the division
            return await _divisionRepository.DeleteAsync(id);
        }

        private DivisionDto MapToDto(Division division)
        {
            var dto = _mapper.Map<DivisionDto>(division);
            if (division.Department != null)
            {
                dto.DepartmentName = division.Department.Name;
            }
            return dto;
        }

        private IEnumerable<DivisionDto> MapToDtoList(IEnumerable<Division> divisions)
        {
            var result = new List<DivisionDto>();
            foreach (var division in divisions)
            {
                result.Add(MapToDto(division));
            }
            return result;
        }
    }
}
