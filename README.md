# StacksQnA - Telegram Quiz Bot

StacksQnA is an interactive Telegram bot that quizzes users on their knowledge of the **Stacks blockchain**. Users can answer questions, set a timer for each round, and view their score at the end of the quiz.

## Features

- **Interactive Quiz**: Answer multiple-choice questions about the Stacks blockchain.
- **Score Tracking**: View your final score after completing the quiz.
- **Customizable Timer**: Set a timer for each round to challenge yourself against the clock.
- **Quiz History**: See the questions you got wrong and retry them later.
  
## How to Use

1. **Start the Quiz**: Send the `/start` command to begin the quiz.
2. **Answer Questions**: The bot will provide multiple-choice questions. Simply click on the correct answer.
3. **Set a Timer**: You can set a timer for each question round using `/settimer` followed by the time in seconds (e.g., `/settimer 30` for 30 seconds).
4. **View Score**: After completing the quiz, the bot will display your score.
5. **Review Incorrect Answers**: Use the `/retry` command to review and retry any questions you answered incorrectly.

## Commands

- `/start` - Start a new quiz.
- `/settimer [seconds]` - Set a timer for each question round.
- `/score` - View your current score.
- `/retry` - Retry the questions you answered incorrectly.
- `/help` - View a list of available commands.

## Installation

### Prerequisites

- Byb (>=1.x)
- Telegram account

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/stacksQnA.git
   cd stacksQnA

    Install dependencies:

    bash

bun install

Create a .env file in the root directory and add your Telegram Bot Token:

bash

TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here.. and other envs

Start the bot:

bash

    bun run dev

    Open Telegram, search for your bot, and start chatting!

Built With

    Node.js: Backend environment.
    Telegram Bot API: To communicate with users.
    Stacks Blockchain: Quiz topics are centered around this blockchain technology.

Contributing

We welcome contributions! If you have ideas for new features or improvements, feel free to open an issue or create a pull request.

    Fork the project.
    Create your feature branch: git checkout -b feature/AmazingFeature.
    Commit your changes: git commit -m 'Add some AmazingFeature'.
    Push to the branch: git push origin feature/AmazingFeature.
    Open a pull request.

License

This project is licensed under the MIT License.
Acknowledgments

    Telegram Bot API for making bot development easy.
    The Stacks community for inspiration and education on blockchain technology.

vbnet


This is in the correct markdown format and ready to be used as a README on GitHub
