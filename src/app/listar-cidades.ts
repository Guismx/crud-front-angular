import { Component } from '@angular/core';
import { ImportsModule } from './imports';
import { Cidade } from '@domain/cidade';
import { ProjetoService } from '@service/projeto-service';
import { CadastrarCidade } from './cadastrar-cidade';
import { MessageService } from 'primeng/api';

//-------------------------------------------------------------------------------------
// Tela para listar cidades
//-------------------------------------------------------------------------------------
@Component({
    selector: 'listar-cidades',
    templateUrl: 'listar-cidades.html',
    standalone: true,
    imports: [ImportsModule, CadastrarCidade],
    providers: [ProjetoService, MessageService]
})
export class ListarCidades {
    //-------------------------------------------------------
    // Lista de cidades, exibida na tabela
    //-------------------------------------------------------
    listaCidades!: Cidade[];

    //-------------------------------------------------------------
    // Atributo que guarda a cidade que foi selecionada na tabela
    //-------------------------------------------------------------
    cidadeSelecionada: Cidade = new Cidade();

    //-------------------------------------------------------------
    // Flag usada para mostrar/esconder a janela de cadastro
    //-------------------------------------------------------------
    mostraJanelaCadastro: boolean = false;

    //--------------------------------------------------------------
    /** Construtor. Recebe os services usados pelo componente */
    //--------------------------------------------------------------
    constructor(private service: ProjetoService, private messageService: MessageService) {}

    //-------------------------------------------------------------------------------------
    /** Inicializacao do componente. Recupera a lista de cidades para exibir na tabela */
    //-------------------------------------------------------------------------------------
    ngOnInit() {
        this.pesquisarCidades();
    }

    //-------------------------------------------------------------------------------------
    /** Método chamado para recuperar cidades para a tabela */
    //-------------------------------------------------------------------------------------
    private pesquisarCidades(): void {
        this.service.pesquisarCidades().subscribe(
            (dados) => {
                this.listaCidades = dados;
            },
            (erro) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar cidades.' });
            }
        );
    }

    //-------------------------------------------------------------------------------------
    /** Método chamado ao clicar no botão 'Nova Cidade' */
    //-------------------------------------------------------------------------------------
    public abreJanelaParaCadastrarNovaCidade() {
        // Define a cidade selecionada como uma nova cidade
        this.cidadeSelecionada = new Cidade();

        // Exibe a janela de cadastro
        this.mostraJanelaCadastro = true;
    }

    //-------------------------------------------------------------------------------------
    /** Método chamado ao clicar no botão 'Alterar' */
    //-------------------------------------------------------------------------------------
    public abreJanelaParaAlterarCidade(cidade: Cidade): void {
        // Copia os dados da cidade selecionada para uma nova cidade
        this.cidadeSelecionada = { ...cidade };

        // Exibe a janela de cadastro
        this.mostraJanelaCadastro = true;
    }

    //-------------------------------------------------------------------------------------
    /** Método chamado ao clicar no botão 'Excluir' */
    //-------------------------------------------------------------------------------------
    public excluir(cidade: Cidade) {
        console.log(`Excluindo cidade com ID: ${cidade.id}`);
        this.service.excluir(cidade).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Cidade '${cidade.nome}' excluída com sucesso!` });
                setTimeout(() => this.pesquisarCidades(), 100);
            },
            error: (erro) => {
                console.error(`Erro ao excluir cidade:`, erro);
                if (erro.error) {
                    console.error('Detalhes do erro:', erro.error);
                }
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Falha ao excluir cidade '${cidade.nome}'.` });
            }
        });
    }
    //-------------------------------------------------------------------------------------
    /** Método chamado quando a janela de cadastro é fechada */
    //-------------------------------------------------------------------------------------
    public fechaJanelaCadastro(salvou: boolean): void {
        // Esconde a janela de cadastro
        this.mostraJanelaCadastro = false;

        // Se salvou, atualiza a lista de cidades
        if (salvou) {
            setTimeout(() => this.pesquisarCidades(), 100);
        }
    }
}
