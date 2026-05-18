import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AiRequestDto, AiResponseDto } from '../models/transaction.dto';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ai`;

  async askAi(message: string): Promise<AiResponseDto> {
    const request: AiRequestDto = { message };
    return await firstValueFrom(this.http.post<AiResponseDto>(`${this.apiUrl}/ask`, request));
  }
}
