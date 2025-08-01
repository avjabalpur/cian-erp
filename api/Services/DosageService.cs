using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.Dosage;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class DosageService : IDosageService
    {
        private readonly IDosageRepository _dosageRepository;
        private readonly IMapper _mapper;

        public DosageService(IDosageRepository dosageRepository, IMapper mapper)
        {
            _dosageRepository = dosageRepository ?? throw new ArgumentNullException(nameof(dosageRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<DosageDto> GetByIdAsync(int id)
        {
            var dosage = await _dosageRepository.GetByIdAsync(id);
            if (dosage == null)
            {
                throw new NotFoundException($"Dosage with ID {id} not found");
            }

            return _mapper.Map<DosageDto>(dosage);
        }

        public async Task<PaginatedResult<DosageDto>> GetAllAsync()
        {
            var dosages = await _dosageRepository.GetAllAsync();

            var dtos = _mapper.Map<IEnumerable<DosageDto>>(dosages);

            return new PaginatedResult<DosageDto>
            {
                Items = dtos.ToList(),
                PageNumber = 1,
                PageSize = dtos.Count()
            };
        }

        public async Task<DosageDto> CreateAsync(CreateDosageDto createDto, int userId)
        {
            // Check if dosage with same name already exists
            if (await _dosageRepository.ExistsByNameAsync(createDto.Name))
            {
                throw new ValidationException($"Dosage with name '{createDto.Name}' already exists");
            }

            var dosage = _mapper.Map<Dosage>(createDto);
            dosage.CreatedBy = userId;
            dosage.CreatedAt = DateTime.UtcNow;

            var createdDosage = await _dosageRepository.CreateAsync(dosage);
            return _mapper.Map<DosageDto>(createdDosage);
        }

        public async Task<DosageDto> UpdateAsync(int id, UpdateDosageDto updateDto, int userId)
        {
            // Check if dosage exists
            if (!await _dosageRepository.ExistsAsync(id))
            {
                throw new NotFoundException($"Dosage with ID {id} not found");
            }

            // Check if dosage with same name already exists (excluding current record)
            if (await _dosageRepository.ExistsByNameAsync(updateDto.Name, id))
            {
                throw new ValidationException($"Dosage with name '{updateDto.Name}' already exists");
            }

            var existingDosage = await _dosageRepository.GetByIdAsync(id);
            _mapper.Map(updateDto, existingDosage);
            existingDosage.UpdatedBy = userId;
            existingDosage.UpdatedAt = DateTime.UtcNow;

            var updatedDosage = await _dosageRepository.UpdateAsync(existingDosage);
            return _mapper.Map<DosageDto>(updatedDosage);
        }

        public async Task DeleteAsync(int id)
        {
            if (!await _dosageRepository.ExistsAsync(id))
            {
                throw new NotFoundException($"Dosage with ID {id} not found");
            }

            await _dosageRepository.DeleteAsync(id);
        }
    }
} 