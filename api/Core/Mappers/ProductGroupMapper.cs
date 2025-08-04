using AutoMapper;
using Xcianify.Core.DTOs.ProductGroup;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ProductGroupMapper : Profile
    {
        public ProductGroupMapper()
        {
            CreateMap<ProductGroup, ProductGroupDto>();
            CreateMap<CreateProductGroupDto, ProductGroup>();
            CreateMap<UpdateProductGroupDto, ProductGroup>();
        }
    }
} 