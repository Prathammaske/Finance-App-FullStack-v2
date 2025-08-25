using AutoMapper;
using PersonalFinance.API.DTOs.Account;
using PersonalFinance.API.DTOs.Budget;
using PersonalFinance.API.DTOs.Category;
using PersonalFinance.API.DTOs.Transaction; // We will create this next
using PersonalFinance.API.Models;

namespace PersonalFinance.API.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Simple mappings (source -> destination)
            CreateMap<Category, CategoryDto>();
            CreateMap<Account, AccountDto>();

            // More complex mapping for Transaction
            // This rule tells AutoMapper how to get CategoryName and AccountName
            CreateMap<Transaction, TransactionDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category!.Name))
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Account!.Name));

            CreateMap<Budget, BudgetDto>()
    .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category!.Name));
        }
    }
}