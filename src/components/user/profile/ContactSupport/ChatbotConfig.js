// ChatbotConfig.js - Configuration for the React Chatbot Kit
import { createChatBotMessage } from 'react-chatbot-kit';
import BotAvatar from './BotAvatar';
import UserAvatar from './UserAvatar';
import Options from './Options';

const config = {
  initialMessages: [
    createChatBotMessage("Hello! Welcome to S4 Support. How can I help you today?", {
      widget: "options",
    }),
  ],
  botName: "S4 Support",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#fff",
      border: "1px solid #e2e8f0",
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
      widgetName: "options",
      widgetFunc: Options,
    },
  ],
};

export default config;