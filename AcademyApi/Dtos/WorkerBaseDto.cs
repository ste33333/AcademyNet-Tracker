using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace AcademyApi.Dtos
{
    public class WorkerBaseDto 
    {
        [Required]
        [MaxLength(35)]
        public string FullName { get; set; }

        [Required]
        [MaxLength(50)]
        public string Role { get; set; }

        [Required]
        [MaxLength(50)]
        public string Department { get; set; }

        public short? Age { get; set; }

        [MaxLength(50)]
        public string? Address { get; set; }

        [MaxLength(50)]
        public string? City { get; set; }

        [MaxLength(50)]
        public string? Province { get; set; }

        [StringLength(5)] 
        public string? CAP { get; set; }

        [MaxLength(50)]
        [Phone] // Aggiunge validazione formato telefono
        public string? Phone { get; set; }
    }
}
