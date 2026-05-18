import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div class="flex items-center justify-between mb-8 px-1">
        <div>
          <h1 class="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest">Neural Advisor</h1>
          <div class="h-1 w-6 bg-primary mt-2"></div>
        </div>
        <div class="flex items-center space-x-3">
          <span class="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase rounded-lg tracking-widest shadow-sm">GPT-4o Intelligence</span>
        </div>
      </div>

      <div class="card h-[600px] flex flex-col p-0 overflow-hidden shadow-xl border-border/40">
        <!-- Chat Header -->
        <div class="px-6 py-4 border-b border-border bg-foreground/[0.02] flex items-center space-x-4">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 class="text-xs font-black text-foreground uppercase tracking-widest">Financial Intelligence Core</h3>
            <p class="text-[9px] font-bold text-subtle uppercase tracking-widest opacity-60">Analyzing live financial data</p>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-dots-pattern">
          <div *ngIf="messages().length === 0" class="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 grayscale">
             <div class="w-20 h-20 rounded-3xl bg-foreground/[0.03] border border-border flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             </div>
             <div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Query</p>
                <p class="text-[9px] font-bold uppercase tracking-widest">Ask about savings, expenses, or goals</p>
             </div>
          </div>

          <div *ngFor="let msg of messages()" 
               [ngClass]="msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'"
               class="flex flex-col max-w-[85%] animate-fade-in-up">
            <div [ngClass]="msg.role === 'user' ? 'bg-primary text-white rounded-2xl rounded-tr-none shadow-lg shadow-primary/10' : 'bg-foreground/[0.05] text-foreground border border-border rounded-2xl rounded-tl-none'"
                 class="px-5 py-4 text-sm font-medium leading-relaxed">
              {{ msg.content }}
            </div>
            <span class="text-[8px] font-black uppercase tracking-widest opacity-40 mt-2 px-1">
              {{ msg.role === 'user' ? 'Authorized User' : 'Neural Response' }} • {{ msg.timestamp | date:'HH:mm' }}
            </span>
          </div>

          <div *ngIf="isLoading()" class="mr-auto flex flex-col items-start animate-pulse">
            <div class="bg-foreground/[0.05] border border-border rounded-2xl rounded-tl-none px-6 py-4 flex items-center space-x-3">
              <div class="flex space-x-1">
                <div class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest text-subtle">Thinking...</span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-border bg-foreground/[0.02]">
          <form (ngSubmit)="sendMessage()" class="relative flex items-center">
            <input type="text" name="userInput" [(ngModel)]="userInput" 
                   [disabled]="isLoading() || !hasApiKey()"
                   class="input-premium w-full pl-6 pr-16 py-5 shadow-inner"
                   [placeholder]="hasApiKey() ? 'Analyze my spending this month...' : 'Configure API Key in Settings to enable AI'">
            <button type="submit" 
                    [disabled]="isLoading() || !userInput.trim() || !hasApiKey()"
                    class="absolute right-3 p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </form>
        </div>
      </div>

      <!-- Quick Actions -->
      <div *ngIf="hasApiKey()" class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style="animation-delay: 200ms">
        <button (click)="quickAsk('How is my savings rate compared to last month?')" class="p-4 bg-foreground/[0.03] border border-border rounded-2xl text-left hover:bg-foreground/[0.05] transition-all group">
          <p class="text-[9px] font-black text-primary uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">Savings Audit</p>
          <p class="text-[10px] font-bold text-subtle leading-tight">Analyze savings efficiency and rate.</p>
        </button>
        <button (click)="quickAsk('What are my top 3 expense categories and how can I reduce them?')" class="p-4 bg-foreground/[0.03] border border-border rounded-2xl text-left hover:bg-foreground/[0.05] transition-all group">
          <p class="text-[9px] font-black text-expense-label uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">Leak Detection</p>
          <p class="text-[10px] font-bold text-subtle leading-tight">Identify and optimize highest spending.</p>
        </button>
        <button (click)="quickAsk('Based on my current balance and goals, am I on track?')" class="p-4 bg-foreground/[0.03] border border-border rounded-2xl text-left hover:bg-foreground/[0.05] transition-all group">
          <p class="text-[9px] font-black text-income-label uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">Strategy Sync</p>
          <p class="text-[10px] font-bold text-subtle leading-tight">Validate progress towards strategic targets.</p>
        </button>
      </div>

      <div *ngIf="!hasApiKey()" class="card border-dashed border-primary/30 bg-primary/5 p-8 text-center animate-bounce-gentle">
         <p class="text-xs font-black text-primary uppercase tracking-widest mb-4">Neural Core Disconnected</p>
         <p class="text-[10px] font-bold text-subtle uppercase tracking-widest mb-6 opacity-80">You must provide an OpenAI API Key to activate financial intelligence.</p>
         <a routerLink="/account" class="btn-premium inline-block px-8 py-4 text-[10px]">Configure Link</a>
      </div>
    </div>
  `,
  styles: [`
    .bg-dots-pattern {
      background-image: radial-gradient(circle, var(--tw-border-opacity) 1px, transparent 1px);
      background-size: 24px 24px;
      background-color: transparent;
    }
  `]
})
export class AiAdvisorComponent {
  private aiService = inject(AiService);
  private authService = inject(AuthService);

  messages = signal<Message[]>([]);
  userInput = '';
  isLoading = signal(false);

  hasApiKey() {
    return !!this.authService.currentUser()?.aiApiKey;
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading()) return;

    const userMessage = this.userInput;
    this.userInput = '';
    
    this.messages.update(m => [...m, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    this.isLoading.set(true);

    try {
      const response = await this.aiService.askAi(userMessage);
      this.messages.update(m => [...m, {
        role: 'ai',
        content: response.response,
        timestamp: new Date()
      }]);
    } catch (e: any) {
      this.messages.update(m => [...m, {
        role: 'ai',
        content: `Connection Error: ${e.message || 'Unknown error calling the intelligence core.'}`,
        timestamp: new Date()
      }]);
    } finally {
      this.isLoading.set(false);
    }
  }

  quickAsk(question: string) {
    this.userInput = question;
    this.sendMessage();
  }
}
