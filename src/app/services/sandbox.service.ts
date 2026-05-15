import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SandboxDto, SandboxMovementDto, CreateSandboxMovementRequest } from '../models/sandbox';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SandboxService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sandbox`;

  getOrCreateSandbox(year: number, month: number): Observable<SandboxDto> {
    return this.http.get<SandboxDto>(`${this.apiUrl}/${year}/${month}`);
  }

  addMovement(sandboxId: string, request: CreateSandboxMovementRequest): Observable<SandboxMovementDto> {
    return this.http.post<SandboxMovementDto>(`${this.apiUrl}/${sandboxId}/movements`, request);
  }

  resetSandbox(sandboxId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sandboxId}`);
  }
}
