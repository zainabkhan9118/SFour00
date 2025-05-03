// ActionProvider.js - Defines the bot's actions and responses
import { createChatBotMessage } from 'react-chatbot-kit';

class ActionProvider {
  constructor(createChatbotMessage, setStateFunc) {
    this.createChatbotMessage = createChatbotMessage;
    this.setState = setStateFunc;
  }

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };

  handleGreeting = () => {
    const message = this.createChatbotMessage(
      "Hello! It's great to see you. How can I assist you today?"
    );
    this.addMessageToState(message);
  };

  handleAccountIssues = () => {
    const message = this.createChatbotMessage(
      "I can help with account issues. Here are some options for account-related questions:",
      {
        widget: "accountOptions",
      }
    );
    
    const followUpMessage = this.createChatbotMessage(
      "For account-related questions, I can help with password resets, profile updates, and account verification. What specific account issue are you experiencing?"
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handlePaymentQuestions = () => {
    const message = this.createChatbotMessage(
      "For payment issues, I'll need a few details to help you properly:"
    );
    
    const followUpMessage = this.createChatbotMessage(
      "Could you please provide your job ID and describe the specific payment problem you're facing? This will help me direct your issue to the right team."
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handleJobApplicationHelp = () => {
    const message = this.createChatbotMessage(
      "I can help with your job application questions!"
    );
    
    const followUpMessage = this.createChatbotMessage(
      "Whether you're having trouble submitting an application, checking your application status, or have questions about a job posting, I'm here to help. What specific issue are you facing with your job application?"
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handleContactHuman = () => {
    const message = this.createChatbotMessage(
      "I understand you'd like to speak with a human support agent."
    );
    
    const followUpMessage = this.createChatbotMessage(
      "You can reach our human support team at support@s4app.com or call us at +44 123 456 7890 during business hours (Monday to Friday, 9 AM - 5 PM GMT). Is there anything specific you need help with that I might be able to assist with while you wait for human support?"
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handleThanks = () => {
    const message = this.createChatbotMessage(
      "You're welcome! I'm always here to help. Is there anything else I can assist you with today?"
    );
    this.addMessageToState(message);
  };

  handleDefault = () => {
    const message = this.createChatbotMessage(
      "I'm not sure I understand. Could you please provide more details or try phrasing your question differently? You can ask about account issues, payments, job applications, or request to speak with a human support agent.",
      {
        widget: "options",
      }
    );
    this.addMessageToState(message);
  };
}

export default ActionProvider;