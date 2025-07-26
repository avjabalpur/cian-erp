using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMedia;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemMediaService
    {
        Task<ItemMediaDto> GetByIdAsync(int id);
        Task<IEnumerable<ItemMediaDto>> GetByItemIdAsync(int itemId);
        Task<ItemMediaDto> CreateAsync(CreateItemMediaDto createDto, int userId);
        Task<ItemMediaDto> UpdateAsync(int id, UpdateItemMediaDto updateDto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
