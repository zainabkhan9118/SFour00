// CompanyChatbotConfig.js - Configuration for the Company React Chatbot Kit
import { createChatBotMessage } from 'react-chatbot-kit';
import BotAvatar from '../../user/profile/ContactSupport/BotAvatar';
import UserAvatar from '../../user/profile/ContactSupport/UserAvatar';
import CompanyOptions from './CompanyOptions';

const config = {
  initialMessages: [
    createChatBotMessage("Welcome to S4 Business Support! How can I assist your company today?", {
      widget: "companyOptions",
    }),
  ],
  botName: "S4 Business Support",
  customStyles: {
    botMessageBox: {
      backgroundColor: "var(--bot-message-bg, #fff)",
      border: "1px solid var(--bot-message-border, #e2e8f0)",
      borderRadius: "0.5rem",
    },
    chatButton: {
      backgroundColor: "#f97316",
    },
  },
  customComponents: {
    botAvatar: BotAvatar,
    userAvatar: UserAvatar,
  },
  widgets: [
    {
      widgetName: "companyOptions",
      widgetFunc: CompanyOptions,
    },
  ],
};

export default config;