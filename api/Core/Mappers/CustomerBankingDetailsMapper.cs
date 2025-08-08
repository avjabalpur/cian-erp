using AutoMapper;
using Xcianify.Core.DTOs.CustomerBankingDetails;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class CustomerBankingDetailsMapper : Profile
    {
        public CustomerBankingDetailsMapper()
        {
            CreateMap<CustomerBankingDetails, CustomerBankingDetailsDto>();
            CreateMap<CreateCustomerBankingDetailsDto, CustomerBankingDetails>();
            CreateMap<UpdateCustomerBankingDetailsDto, CustomerBankingDetails>();
        }
    }
}
