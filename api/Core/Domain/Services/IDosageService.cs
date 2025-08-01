using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.Dosage;

namespace Xcianify.Core.Domain.Services
{
    public interface IDosageService
    {
        Task<DosageDto> GetByIdAsync(int id);
        Task<PaginatedResult<DosageDto>> GetAllAsync();
        Task<DosageDto> CreateAsync(CreateDosageDto createDto, int userId);
        Task<DosageDto> UpdateAsync(int id, UpdateDosageDto updateDto, int userId);
        Task DeleteAsync(int id);
    }
} 