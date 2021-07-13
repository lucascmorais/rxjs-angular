import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

const ESPERA_DIGITACAO = 500;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  
  todasAcoes$ = this.acoesServices.getAcoes()
    .pipe(
      tap(() => console.log('Fluxo inicial'))
    );
  
  filtroPeloInput$ = this.acoesInput.valueChanges
    .pipe(
      debounceTime(ESPERA_DIGITACAO),
      tap(() => console.log('Fluxo do filtro')),
      tap(console.log),
      filter((valor) => valor.length >= 3 || !valor.length),
      distinctUntilChanged(),
      switchMap((valor) => this.acoesServices.getAcoes(valor)),
      tap(console.log)
    );
  
  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(private acoesServices: AcoesService) {}

}
