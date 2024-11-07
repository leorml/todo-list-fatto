import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/service/tarefas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  novaTarefa = {
    titulo: '',
    preco: 0,
    prazo: '',
  };

  tarefas: any[] = [];
  isEditMode = false;
  tarefaEmEdicao: any = null;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadTarefas();
  }

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

  adicionarTarefa() {
    if (this.novaTarefa.titulo.trim() && this.novaTarefa.preco >= 0) {
      const tarefaParaSalvar = {
        text: this.novaTarefa.titulo,
        price: this.novaTarefa.preco,
        deadline: this.novaTarefa.prazo,
      };

      if (this.isEditMode && this.tarefaEmEdicao) {
        this.tarefaEmEdicao.text = this.novaTarefa.titulo;
        this.tarefaEmEdicao.price = this.novaTarefa.preco;
        this.tarefaEmEdicao.deadline = this.novaTarefa.prazo;

        this.postService.updatePost(this.tarefaEmEdicao).subscribe(
          (res) => {
            console.log('Tarefa atualizada:', res);
            this.resetForm();
          },
          (error) => {
            console.error('Erro ao atualizar tarefa:', error);
          }
        );
      } else {
        this.postService.createPost(tarefaParaSalvar).subscribe(
          (res) => {
            this.tarefas.push(res.data);
            this.resetForm();
          },
          (error) => {
            console.error(
              'Erro ao adicionar tarefa:',
              error.error?.message || error
            );
          }
        );
      }
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  editarTarefa(tarefa: any) {
    this.isEditMode = true;
    this.tarefaEmEdicao = tarefa;
    this.novaTarefa = {
      titulo: tarefa.text,
      preco: tarefa.price,
      prazo: tarefa.deadline,
    };
  }

  removerTarefa(tarefa: any) {
    if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
      const index = this.tarefas.indexOf(tarefa);
      if (index >= 0) {
        this.tarefas.splice(index, 1);
        this.postService.deletePost(tarefa.id).subscribe(
          (res) => {
            console.log('Tarefa removida:', res);
          },
          (error) => {
            console.error('Erro ao remover tarefa:', error);
          }
        );
      }
    }
  }

  resetForm() {
    this.novaTarefa = { titulo: '', preco: 0, prazo: '' };
    this.isEditMode = false;
    this.tarefaEmEdicao = null;
  }
}
