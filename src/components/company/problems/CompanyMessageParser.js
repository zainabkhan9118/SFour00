// CompanyMessageParser.js - Handles parsing company messages
import MessageParser from '../../user/profile/ContactSupport/MessageParser';

class CompanyMessageParser extends MessageParser {
  constructor(actionProvider, state) {
    super(actionProvider, state);
    this.isCompany = true;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();
    
    // Company-specific keyword handlers
    if (lowerCaseMessage.includes("recruit") || 
        lowerCaseMessage.includes("hire") ||
        lowerCaseMessage.includes("talent") ||
        lowerCaseMessage.includes("candidate")) {
      return this.actionProvider.handleRecruitmentIssues();
    }
    
    if (lowerCaseMessage.includes("subscription") || 
        lowerCaseMessage.includes("plan") ||
        lowerCaseMessage.includes("upgrade") ||
        lowerCaseMessage.includes("premium") ||
        lowerCaseMessage.includes("billing")) {
      return this.actionProvider.handleSubscriptionQuestions();
    }
    
    if (lowerCaseMessage.includes("post") || 
        lowerCaseMessage.includes("job listing") ||
        lowerCaseMessage.includes("job post") ||
        lowerCaseMessage.includes("edit job") ||
        lowerCaseMessage.includes("delete job")) {
      return this.actionProvider.handleJobPostingHelp();
    }
    
    // For other general keywords, use the base implementation
    return super.parse(message);
  }
}

export default CompanyMessageParser;