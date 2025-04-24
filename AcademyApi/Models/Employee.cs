using System;
using System.Collections.Generic;

namespace AcademyApi.Models;

public partial class Employee
{
    public string Enrollment { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string Department { get; set; } = null!;

    public byte Age { get; set; }

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string Province { get; set; } = null!;

    public short Cap { get; set; }

    public int Phone { get; set; }
}
