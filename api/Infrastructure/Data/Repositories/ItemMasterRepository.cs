using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xcianify.Core.Domain.Models;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.DTOs.Pagination;
using Xcianify.Infrastructure.Data;

namespace Xcianify.Infrastructure.Data.Repositories
{
    public class ItemMasterRepository : IItemMasterRepository
    {
        private readonly AppDbContext _context;

        public ItemMasterRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<ItemMaster> GetByIdAsync(int id)
        {
            return await _context.ItemMasters
                .Include(i => i.Specification)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<ItemMaster> GetByItemCodeAsync(string itemCode)
        {
            return await _context.ItemMasters
                .Include(i => i.Specification)
                .FirstOrDefaultAsync(i => i.ItemCode == itemCode);
        }

        public async Task<PaginatedResult<ItemMaster>> GetAllAsync(ItemMasterFilterDto filter)
        {
            var query = _context.ItemMasters
                .Include(i => i.Specification)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.search))
            {
                var search = filter.search.ToLower();
                query = query.Where(i =>
                    i.ItemCode.ToLower().Contains(search) ||
                    i.ItemName.ToLower().Contains(search) ||
                    i.ShortName.ToLower().Contains(search));
            }

            if (filter.ItemTypeId.HasValue)
            {
                query = query.Where(i => i.ItemTypeId == filter.ItemTypeId.Value);
            }

            var totalItems = await query.CountAsync();
            var items = await query
                .OrderBy(i => i.ItemCode)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PaginatedResult<ItemMaster>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<ItemMaster> CreateAsync(ItemMaster item)
        {
            if (await ItemCodeExistsAsync(item.ItemCode))
            {
                throw new InvalidOperationException($"Item with code {item.ItemCode} already exists.");
            }

            item.CreatedOn = DateTime.UtcNow;
            
            if (item.Specification != null)
            {
                _context.ItemSpecifications.Add(item.Specification);
            }
            
            _context.ItemMasters.Add(item);
            await _context.SaveChangesAsync();
            
            return item;
        }

        public async Task<ItemMaster> UpdateAsync(ItemMaster item)
        {
            if (await ItemCodeExistsAsync(item.ItemCode, item.Id))
            {
                throw new InvalidOperationException($"Another item with code {item.ItemCode} already exists.");
            }

            var existingItem = await _context.ItemMasters
                .Include(i => i.Specification)
                .FirstOrDefaultAsync(i => i.Id == item.Id);

            if (existingItem == null)
            {
                throw new KeyNotFoundException($"Item with ID {item.Id} not found.");
            }

            // Update properties
            _context.Entry(existingItem).CurrentValues.SetValues(item);

            // Update specification
            if (item.Specification != null)
            {
                if (existingItem.Specification != null)
                {
                    item.Specification.Id = existingItem.Specification.Id;
                    _context.Entry(existingItem.Specification).CurrentValues.SetValues(item.Specification);
                }
                else
                {
                    existingItem.Specification = item.Specification;
                }
            }

            await _context.SaveChangesAsync();
            return existingItem;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var item = await _context.ItemMasters.FindAsync(id);
            if (item == null)
            {
                return false;
            }

            _context.ItemMasters.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ItemCodeExistsAsync(string itemCode, int? excludeId = null)
        {
            return await _context.ItemMasters
                .AnyAsync(i => i.ItemCode == itemCode && (!excludeId.HasValue || i.Id != excludeId.Value));
        }
    }
}
