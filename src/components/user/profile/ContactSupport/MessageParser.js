// MessageParser.js - Handles parsing user messages
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();
    
    // Check for keywords in the user message
    if (lowerCaseMessage.includes("account") || 
        lowerCaseMessage.includes("login") ||
        lowerCaseMessage.includes("profile") ||
        lowerCaseMessage.includes("password")) {
      return this.actionProvider.handleAccountIssues();
    }
    
    if (lowerCaseMessage.includes("payment") || 
        lowerCaseMessage.includes("invoice") ||
        lowerCaseMessage.includes("bill") ||
        lowerCaseMessage.includes("money") ||
        lowerCaseMessage.includes("pay")) {
      return this.actionProvider.handlePaymentQuestions();
    }
    
    if (lowerCaseMessage.includes("job") || 
        lowerCaseMessage.includes("apply") ||
        lowerCaseMessage.includes("application") ||
        lowerCaseMessage.includes("work") ||
        lowerCaseMessage.includes("position") ||
        lowerCaseMessage.includes("hire")) {
      return this.actionProvider.handleJobApplicationHelp();
    }
    
    if (lowerCaseMessage.includes("human") || 
        lowerCaseMessage.includes("person") ||
        lowerCaseMessage.includes("agent") ||
        lowerCaseMessage.includes("representative") ||
        lowerCaseMessage.includes("speak") ||
        lowerCaseMessage.includes("talk") ||
        lowerCaseMessage.includes("contact")) {
      return this.actionProvider.handleContactHuman();
    }
    
    if (lowerCaseMessage.includes("hello") || 
        lowerCaseMessage.includes("hi") ||
        lowerCaseMessage.includes("hey") ||
        lowerCaseMessage.includes("greetings")) {
      return this.actionProvider.handleGreeting();
    }
    
    if (lowerCaseMessage.includes("thank")) {
      return this.actionProvider.handleThanks();
    }
    
    // Default response if no keywords match
    return this.actionProvider.handleDefault();
  }
}

export default MessageParser;