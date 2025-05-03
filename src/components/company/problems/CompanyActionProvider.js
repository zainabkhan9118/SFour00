// CompanyActionProvider.js - Defines the company bot's actions and responses
import ActionProvider from '../../user/profile/ContactSupport/ActionProvider';

class CompanyActionProvider extends ActionProvider {
  constructor(createChatbotMessage, setStateFunc) {
    super(createChatbotMessage, setStateFunc);
  }

  handleGreeting = () => {
    const message = this.createChatbotMessage(
      "Hello! Welcome to S4 Company Support. How can we assist your business today?"
    );
    this.addMessageToState(message);
  };

  handleRecruitmentIssues = () => {
    const message = this.createChatbotMessage(
      "I can help with recruitment and talent acquisition questions."
    );
    
    const followUpMessage = this.createChatbotMessage(
      "Our platform offers various tools to help you find the right candidates. What specific recruitment issue are you facing? Are you looking to improve candidate screening, application management, or perhaps need help with writing better job descriptions?"
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handleSubscriptionQuestions = () => {
    const message = this.createChatbotMessage(
      "I can help answer questions about your company's subscription plan."
    );
    
    const followUpMessage = this.createChatbotMessage(
      "Whether you're looking to upgrade your plan, understand billing cycles, or manage payment methods, I'm here to help. What specific information about your subscription do you need?"
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handleJobPostingHelp = () => {
    const message = this.createChatbotMessage(
      "I can help with your job posting questions!"
    );
    
    const followUpMessage = this.createChatbotMessage(
      "Whether you need help creating a new job listing, editing an existing one, or understanding how to optimize your job posts for better visibility, I'm here to assist. What specific issue are you having with job postings?"
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handleAccountIssues = () => {
    const message = this.createChatbotMessage(
      "I can help with company account issues."
    );
    
    const followUpMessage = this.createChatbotMessage(
      "For company account questions, I can help with administrator access, team member management, and company profile settings. What specific account issue are you experiencing?"
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handlePaymentQuestions = () => {
    const message = this.createChatbotMessage(
      "For company payment issues, I'll need a few details to help you properly:"
    );
    
    const followUpMessage = this.createChatbotMessage(
      "Could you please provide your company ID and describe the specific payment or billing problem you're facing? This will help me direct your issue to the right team."
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handleContactHuman = () => {
    const message = this.createChatbotMessage(
      "I understand you'd like to speak with a human support representative."
    );
    
    const followUpMessage = this.createChatbotMessage(
      "You can reach our business support team at business@s4app.com or call our dedicated company support line at +44 123 456 7890 during business hours (Monday to Friday, 9 AM - 5 PM GMT). Is there anything specific about your company account that I might be able to assist with while you wait?"
    );
    
    this.addMessageToState(message);
    setTimeout(() => this.addMessageToState(followUpMessage), 800);
  };

  handleDefault = () => {
    const message = this.createChatbotMessage(
      "I'm not sure I understand. As your company support assistant, I can help with recruitment, job postings, subscription plans, account management, and payment issues. Could you please provide more details or try phrasing your question differently?",
      {
        widget: "options",
      }
    );
    this.addMessageToState(message);
  };
}

export default CompanyActionProvider;