using AutoMapper;
using Xcianify.Core.DTOs.ProductType;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ProductTypeMapper : Profile
    {
        public ProductTypeMapper()
        {
            CreateMap<ProductType, ProductTypeDto>();
            CreateMap<CreateProductTypeDto, ProductType>();
            CreateMap<UpdateProductTypeDto, ProductType>();
        }
    }
} 