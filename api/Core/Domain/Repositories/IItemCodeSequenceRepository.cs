using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemCodeSequenceRepository
    {
        Task<ItemCodeSequence> CreateAsync(ItemCodeSequence entity);
        Task<int> GetNextSequenceNumberAsync();
    }
}
