using System.ComponentModel.DataAnnotations;
using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.DTOs.Income
{
    public class CreateIncomeRequest
    {

        [Required]
        public PaymentSource Source { get; set; } 


        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}