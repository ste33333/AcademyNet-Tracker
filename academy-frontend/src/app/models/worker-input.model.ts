export interface WorkerBaseInputDto {
    fullName: string;
    role: string;
    department: string;
    age: number | null;       
    address: string | null;   
    city: string | null;
    province: string | null;
    cap: string | null;       
    phone: string | null;
  }
  export interface CreateWorkerDto extends WorkerBaseInputDto {
    enrollment: string; 
  }

  export interface UpdateWorkerDto extends WorkerBaseInputDto {
  }