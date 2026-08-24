import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50"
    >
      <div
        class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg p-6 text-center md:p-12"
      >
        <div class="flex max-w-sm flex-col items-center gap-2 text-center">
          <h1 class="font-extrabold text-9xl text-slate-800 tracking-tighter">404</h1>

          <p class="mt-2 text-slate-500 text-base/relaxed">
            A página que você está procurando pode ter sido <br />
            movida ou simplesmente não existe.
          </p>
        </div>

        <div class="flex w-full max-w-sm min-w-0 flex-col items-center gap-4 mt-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Botão Voltar ao Início -->
            <a
              routerLink="/home"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-6 py-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Voltar ao Início
            </a>

            <a
              routerLink="/pets"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 h-10 px-6 py-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              Explorar Pets
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
