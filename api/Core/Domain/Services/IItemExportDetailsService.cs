using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemExportDetails;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemExportDetailsService
    {
        Task<ItemExportDetailsDto> GetByIdAsync(int id);
        Task<IEnumerable<ItemExportDetailsDto>> GetByItemIdAsync(int itemId);
        Task<ItemExportDetailsDto> CreateAsync(CreateItemExportDetailsDto createDto, int userId);
        Task<ItemExportDetailsDto> UpdateAsync(int id, UpdateItemExportDetailsDto updateDto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
