import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PostService } from 'src/service/tarefas.service';

interface NovaTarefa {
  titulo: string;
  preco: number | null;
  prazo: Date | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  novaTarefa: NovaTarefa = {
    titulo: '',
    preco: null,
    prazo: null,
  };

  tarefas: any[] = [];
  isEditMode = false;
  tarefaEmEdicao: any = null;

  constructor(
    private postService: PostService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTarefas();
  }

  // Carrega a lista de tarefas da API
  loadTarefas() {
    this.postService.loadPosts().subscribe(
      (res) => {
        this.tarefas = res.data;
      },
      (error) => {
        console.error('Erro ao carregar tarefas:', error);
      }
    );
  }

  // Adiciona ou edita uma tarefa
  adicionarTarefa() {
    if (this.novaTarefa.titulo.trim() && this.novaTarefa.preco! >= 0) {
      const tarefaParaSalvar = {
        text: this.novaTarefa.titulo,
        price: this.novaTarefa.preco,
        deadline: this.novaTarefa.prazo,
      };

      // Se estiver em modo de edição, atualiza a tarefa
      if (this.isEditMode && this.tarefaEmEdicao) {
        this.tarefaEmEdicao.text = this.novaTarefa.titulo;
        this.tarefaEmEdicao.price = this.novaTarefa.preco;
        this.tarefaEmEdicao.deadline = this.novaTarefa.prazo;

        this.postService.updatePost(this.tarefaEmEdicao).subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Tarefa editada com sucesso!',
            });
            this.resetForm();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Já existe uma tarefa com este nome!',
            });

            console.error('Erro ao atualizar tarefa:', error);
          }
        );
      } else {
        // Caso contrário, cria uma nova tarefa
        this.postService.createPost(tarefaParaSalvar).subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Tarefa adicionada com sucesso!',
            });
            this.tarefas.push(res.data);
            this.resetForm();
          },
          (error) => {
            console.error(
              'Erro ao adicionar tarefa:',
              error.error?.message || error
            );
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Já existe uma tarefa com este nome!',
            });
          }
        );
      }
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  // Inicia o modo de edição para a tarefa selecionada
  editarTarefa(tarefa: any) {
    this.isEditMode = true;
    this.tarefaEmEdicao = tarefa;

    // Verificando e convertendo o prazo para o formato adequado (Date)

    // Atribuindo o valor no formato correto para a data
    this.novaTarefa = {
      titulo: tarefa.text,
      preco: tarefa.price,
      prazo: new Date(tarefa.deadline),
    };
  }

  // Remove uma tarefa após confirmação
  removerTarefa(tarefa: any) {
    this.confirmationService.confirm({
      message: 'Realmente deseja excluir esta tarefa?',
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        // Remova a tarefa do array APÓS a confirmação da exclusão na API
        this.postService.deletePost(tarefa.id).subscribe({
          next: (res) => {
            const index = this.tarefas.indexOf(tarefa);
            if (index !== -1) {
              this.tarefas.splice(index, 1);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Tarefa excluida com sucesso!',
            });
          },
          error: (error) => {
            console.error('Erro ao remover tarefa:', error);
          },
        });
      },
      reject: () => {
        // Ação a ser executada se o usuário clicar em "Não" (opcional)
      },
    });
  }

  // Troca a posição de uma tarefa na lista
  trocarPosicao(tarefa: any, direction: 'up' | 'down') {
    const index = this.tarefas.indexOf(tarefa);
    if (index !== -1) {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < this.tarefas.length) {
        // Antes de trocar as tarefas, obtenha o ID da tarefa a ser trocada
        const id1 = tarefa.id;
        const id2 = this.tarefas[newIndex].id;

        // Envia a requisição para o backend para trocar as posições
        this.postService.trocaPosicao({ id1, id2 }).subscribe(
          (res) => {
            // Caso a requisição seja bem-sucedida, troque as tarefas na lista local
            const temp = this.tarefas[index];
            this.tarefas[index] = this.tarefas[newIndex];
            this.tarefas[newIndex] = temp;

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Tarefa movida com sucesso!',
            });
          },
          (error) => {
            console.error('Erro ao trocar a posição:', error);
          }
        );
      }
    }
  }

  // Limpa o formulário de tarefas
  resetForm() {
    this.novaTarefa = { titulo: '', preco: null, prazo: null };
    this.isEditMode = false;
    this.tarefaEmEdicao = null;
  }

  formatData(data: Date | null): string {
    // Verifica se a data é null antes de tentar formatá-la
    return data ? this.datePipe.transform(data, 'dd/MM/yyyy') || '' : '';
  }
}
