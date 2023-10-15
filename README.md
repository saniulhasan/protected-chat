

# Protected Chat System with Group Video Calling

This is a secure chat system that allows users to create password-protected chat rooms with specific user limits. Users can chat within these rooms, view the active participants, and distinguish the host with a host icon. Additionally, the system supports group video calls with features like whiteboard, code editor, and host control over video and screen sharing.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

1. **Room Creation**:
   - Users can create password-protected chat rooms.
   - Specify the maximum number of participants in a room.
   - Validation 

2. **Chat System**:
   - Securely chat with participants within the room.
   - View a list of active users in the room.
   - Hosts are identified with a host icon.

3. **Group Video Calls (In Development)**:
   - Real-time video conferencing.
   - Whiteboard for collaborative drawing.
   - Code editor for shared coding experiences.
   - Host control over video and screen sharing.

4. **Code Generation**:
   - Generate codes for group video calls.
   - Join video calls with a username and the generated code.

## Technologies Used

- React.js for the frontend.
- Node.js and Socket.io for the backend.
- PeerJS for peer-to-peer communication.
- Tailwind CSS for styling.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your local machine.
- Access to a compatible web browser for video and audio features.

## Installation

1. Clone this repository to your local machine:

   ```shell
   git clone https://github.com/saniulhasan/protected-chat.git
   ```

2. Navigate to the project directory:

   ```shell
   cd protected-chat
   ```

3. Install the required Node.js packages for both the client and server:

   ```shell
   cd client
   npm install
   cd server
   npm install
   ```

4. Create a `.env` file in the `server` directory and add any necessary environment variables (e.g., API keys, secrets).

5. Run the server:

   ```shell
   cd server
   npm start
   ```

6. Start the React client application:

   ```shell
   cd client
   npm start
   ```

## Usage

1. Access the chat system and create password-protected rooms.

2. Chat with participants within the room, view the active users, and distinguish the host.

3. For group video calls (under development), generate a code for the call and join with a username.

4. Explore the video conferencing features, including the whiteboard, code editor, and host control.

## Contributing

Contributions are welcome! To contribute to this project, follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix.

3. Make your changes and commit them.

4. Push your changes to your fork.

5. Create a pull request to the main repository.

Please follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md) in your interactions with the project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Customize this `README.md` with specific information about your application, including screenshots or additional details as needed. Additionally, include a license file (usually named `LICENSE.md`) if you choose to use a different license.
