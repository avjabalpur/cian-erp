using AutoMapper;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs.Customer;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;

        public CustomerService(ICustomerRepository customerRepository, IMapper mapper)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
        }

        public async Task<(List<CustomerDto> items, int totalCount)> GetAllCustomersAsync(CustomerFilterDto filter)
        {
            var (customers, totalCount) = await _customerRepository.GetAllAsync(filter);
            var customerDtos = _mapper.Map<List<CustomerDto>>(customers);
            return (customerDtos, totalCount);
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            return _mapper.Map<CustomerDto>(customer);
        }

        public async Task<CustomerDto?> GetCustomerByCodeAsync(string customerCode)
        {
            var customer = await _customerRepository.GetByCodeAsync(customerCode);
            return _mapper.Map<CustomerDto>(customer);
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto createDto, int currentUserId)
        {
            var customer = _mapper.Map<Customer>(createDto);
            customer.CreatedBy = currentUserId;
            customer.UpdatedBy = currentUserId;
            customer.CreatedAt = DateTime.UtcNow;
            customer.UpdatedAt = DateTime.UtcNow;
            customer.IsDeleted = false;

            var createdCustomer = await _customerRepository.CreateAsync(customer);
            return _mapper.Map<CustomerDto>(createdCustomer);
        }

        public async Task<CustomerDto> UpdateCustomerAsync(int id, UpdateCustomerDto updateDto, int currentUserId)
        {
            var existingCustomer = await _customerRepository.GetByIdAsync(id);
            if (existingCustomer == null)
                throw new ArgumentException($"Customer with ID {id} not found");

            _mapper.Map(updateDto, existingCustomer);
            existingCustomer.UpdatedBy = currentUserId;
            existingCustomer.UpdatedAt = DateTime.UtcNow;

            var updatedCustomer = await _customerRepository.UpdateAsync(existingCustomer);
            return _mapper.Map<CustomerDto>(updatedCustomer);
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            return await _customerRepository.DeleteAsync(id);
        }
    }
} 