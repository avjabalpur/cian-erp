using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.Department;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IMapper _mapper;

        public DepartmentService(
            IDepartmentRepository departmentRepository,
            IMapper mapper)
        {
            _departmentRepository = departmentRepository ?? throw new ArgumentNullException(nameof(departmentRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<DepartmentDto> GetByIdAsync(int id)
        {
            var department = await _departmentRepository.GetByIdAsync(id);
            if (department == null)
                throw new NotFoundException("Department not found");

            return _mapper.Map<DepartmentDto>(department);
        }

        public async Task<DepartmentDto> GetByCodeAsync(string code)
        {
            var department = await _departmentRepository.GetByCodeAsync(code);
            if (department == null)
                throw new NotFoundException("Department not found");

            return _mapper.Map<DepartmentDto>(department);
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
        {
            var departments = await _departmentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
        }

        public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto createDto, int userId)
        {
            // Check if department code already exists
            if (await _departmentRepository.CodeExistsAsync(createDto.Code))
            {
                throw new ValidationException("A department with this code already exists.");
            }

            var department = _mapper.Map<Department>(createDto);
            department.CreatedBy = userId;
            department.UpdatedBy = userId;
            department.CreatedAt = DateTime.UtcNow;
            department.UpdatedAt = DateTime.UtcNow;

            var id = await _departmentRepository.CreateAsync(department);
            return await GetByIdAsync(id);
        }

        public async Task<DepartmentDto> UpdateAsync(int id, UpdateDepartmentDto updateDto, int userId)
        {
            // Check if department exists
            var existingDepartment = await _departmentRepository.GetByIdAsync(id);
            if (existingDepartment == null)
                throw new NotFoundException("Department not found");

            // Check if the new code is already taken by another department
            if (updateDto.Code != existingDepartment.Code && 
                await _departmentRepository.CodeExistsAsync(updateDto.Code, id))
            {
                throw new ValidationException("A department with this code already exists.");
            }

            // Map the DTO to the existing department
            _mapper.Map(updateDto, existingDepartment);
            existingDepartment.UpdatedBy = userId;
            existingDepartment.UpdatedAt = DateTime.UtcNow;

            // Update the department
            var success = await _departmentRepository.UpdateAsync(existingDepartment);
            if (!success)
                throw new ApplicationException("Failed to update department");

            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // Check if department exists
            var existingDepartment = await _departmentRepository.GetByIdAsync(id);
            if (existingDepartment == null)
                throw new NotFoundException("Department not found");

            // Delete the department
            return await _departmentRepository.DeleteAsync(id);
        }
    }
}
