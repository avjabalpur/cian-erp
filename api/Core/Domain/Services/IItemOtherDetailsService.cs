using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemOtherDetails;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemOtherDetailsService
    {
        Task<ItemOtherDetailsDto> GetByIdAsync(int id);
        Task<IEnumerable<ItemOtherDetailsDto>> GetByItemIdAsync(int itemId);
        Task<ItemOtherDetailsDto> CreateAsync(CreateItemOtherDetailsDto createDto, int userId);
        Task<ItemOtherDetailsDto> UpdateAsync(int id, UpdateItemOtherDetailsDto updateDto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
