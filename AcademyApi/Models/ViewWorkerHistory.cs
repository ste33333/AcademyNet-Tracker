using System;
using System.Collections.Generic;

namespace AcademyApi.Models;

public partial class ViewWorkerHistory
{
    public string FullName { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string Department { get; set; } = null!;

    public short? Age { get; set; }

    public string Enrollement { get; set; } = null!;

    public int Id { get; set; }

    public DateOnly WorkDate { get; set; }

    public string? Activity { get; set; }
}
