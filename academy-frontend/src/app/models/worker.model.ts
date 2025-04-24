import { WeekWorkDto } from './week-work.model';

export interface WorkerDto {
    enrollment: string; 
    fullName: string;
    role: string;
    department: string;
}

export interface WorkerDetailDto {
    enrollment: string; 
    fullName: string;
    role: string;
    department: string;
    age: number | null;
    address: string | null;
    city: string | null;
    province: string | null;
    cap: string | null;
    phone: string | null;
    weekWorks: WeekWorkDto[] | null;
}