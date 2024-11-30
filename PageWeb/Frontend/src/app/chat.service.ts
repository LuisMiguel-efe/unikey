import { Injectable } from '@angular/core';
import { conversationTree, Step, Option } from './chat/conversation';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private currentStep: Step;

  constructor() {
    this.currentStep = conversationTree;
  }

  getCurrentStep(): Step {
    return this.currentStep;
  }

  selectOption(option: Option) {
    if (option.next) {
      this.currentStep = option.next;
    } else {
      this.currentStep = { message: option.response || 'Gracias por comunicarte con nosotros.', options: [] };
    }
  }

  resetConversation() {
    this.currentStep = conversationTree;
  }
}
