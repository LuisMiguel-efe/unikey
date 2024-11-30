import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Step, Option } from './conversation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ChatComponent implements OnInit {
  currentStep: Step | null = null;  // Inicializamos como null para evitar el error
  stepHistory: Step [] = [];
  conversationHistory: { sender: string; message: string }[] = [];
  isMinimized = true;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.currentStep = this.chatService.getCurrentStep();
    this.addToHistory('bot', this.currentStep.message);
  }

  selectOption(option: Option) {
    if (this.currentStep) {
      this.stepHistory.push(this.currentStep)
    }

    this.addToHistory('user', option.text);
    if (option.response){
      this.addToHistory('bot',option.response)
    }

    if(option.next){
      this.currentStep = option.next;
      this.addToHistory('bot', this.currentStep.message);
    }else{
      this.currentStep = null;
    }
    this.chatService.selectOption(option);
    this.currentStep = this.chatService.getCurrentStep();
  }

  goBack() {
    // Volver al paso anterior si existe
    if (this.stepHistory.length) {
      this.currentStep = this.stepHistory.pop() as Step;
     }
  }

  resetChat() {
    this.chatService.resetConversation();
    this.currentStep = this.chatService.getCurrentStep();
    this.stepHistory = [];
    this.conversationHistory = [];
    this.addToHistory('bot', this.currentStep.message);
  }

  private addToHistory(sender: string, message: string) {
    this.conversationHistory.push({ sender, message });
  }

  toggleChat(){
    this.isMinimized = !this.isMinimized;
  }
}

