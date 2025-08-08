using AutoMapper;
using Xcianify.Core.DTOs.CustomerBusinessTerms;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class CustomerBusinessTermsMapper : Profile
    {
        public CustomerBusinessTermsMapper()
        {
            CreateMap<CustomerBusinessTerms, CustomerBusinessTermsDto>();
            CreateMap<CreateCustomerBusinessTermsDto, CustomerBusinessTerms>();
            CreateMap<UpdateCustomerBusinessTermsDto, CustomerBusinessTerms>();
        }
    }
}
