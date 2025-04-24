using System.ComponentModel.DataAnnotations;

namespace AcademyApi.Dtos
{
    public class CreateWorkerDto : WorkerBaseDto 
    {
        [Required]
        [RegularExpression("^[A-Z]\\d{3}$", ErrorMessage = "Enrollment must be 1 uppercase letter followed by 3 digits (e.g., A123).")] 
        [StringLength(4, MinimumLength = 4, ErrorMessage = "Enrollment must be exactly 4 characters long.")]

        public string Enrollment { get; set; }
    }
}
