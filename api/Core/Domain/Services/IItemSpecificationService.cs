using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemSpecificationService
    {
        Task<ItemSpecificationDto> GetByItemIdAsync(int itemId);
        Task<ItemSpecificationDto> CreateAsync(CreateItemSpecificationDto createDto, int userId);
        Task<ItemSpecificationDto> UpdateAsync(int itemId, UpdateItemSpecificationDto updateDto, int userId);
        Task<bool> DeleteAsync(int itemId);
    }
} 