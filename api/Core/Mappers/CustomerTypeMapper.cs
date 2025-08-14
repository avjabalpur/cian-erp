using AutoMapper;
using Xcianify.Core.DTOs.CustomerType;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class CustomerTypeMapper : Profile
    {
        public CustomerTypeMapper()
        {
            CreateMap<CustomerType, CustomerTypeDto>();
            CreateMap<CreateCustomerTypeDto, CustomerType>();
            CreateMap<UpdateCustomerTypeDto, CustomerType>();
        }
    }
} 