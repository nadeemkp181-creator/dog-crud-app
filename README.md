
## Installation

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   copy .env.example .env
   ```

4. Update `.env` with your MongoDB credentials:
   ```
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
   MONGO_DB=your_database_name
   ```

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will start on `http://localhost:3000`

## Routes

### Index Routes
- `GET /` - Home page

### Dog Routes
- `GET /dogs` - List all dogs (sorted by newest first)
- `GET /dogs/new` - Show create form
- `POST /dogs` - Create a new dog
- `GET /dogs/:id` - Show dog details
- `GET /dogs/:id/edit` - Show edit form
- `POST /dogs/:id/edit` - Update dog
- `POST /dogs/:id/delete` - Delete dog

## Technologies Used

- **Express.js** - Web framework
- **Mongoose** - MongoDB object modeling
- **MongoDB** - NoSQL database
- **EJS** - Templating engine
- **Node.js** - Runtime environment
- **dotenv** - Environment variable management

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=Cluster0
MONGO_DB=your_database_name
```



