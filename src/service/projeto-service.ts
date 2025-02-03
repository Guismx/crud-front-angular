import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cidade } from '@domain/cidade';
import { Observable } from 'rxjs';
import { environment } from "../app/environments/environment";

@Injectable()
export class ProjetoService {
  
  private apiUrl = `${environment.apiUrl}/cidades`;

  constructor(private http: HttpClient) {}

  //------------------------------------------------
  /** Recupera a lista de cidades */
  //------------------------------------------------
  pesquisarCidades(): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(this.apiUrl);
  }

  //------------------------------------------------
  /** Exclui a cidade informada */
  //------------------------------------------------
  excluir(cidade: Cidade): Observable<any> {
    const url = `${this.apiUrl}/${cidade.id}`;
    console.log(`Deleting city with URL: ${url}`);
    return this.http.delete(url);
  }
  
  //------------------------------------------------
  /** Salva ou atualiza a cidade informada */
  //------------------------------------------------
  salvar(cidade: Cidade): Observable<any> {
    if (cidade.id) {
      return this.http.put<Cidade>(this.apiUrl, cidade);
    } else {
      return this.http.post<Cidade>(this.apiUrl, cidade);
    }
  }
}
