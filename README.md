# Random Number Backend

Backend API for the Random Number Prediction Game.

## Features

- Time-based random number generation
- Prediction validation and scoring
- Session management
- CORS configuration for frontend integration
- Real-time number updates

## API Endpoints

- `GET /api/current-number` - Get the current random number
- `POST /api/predict` - Submit a prediction
- `GET /api/health` - Health check endpoint

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your configuration

3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `FRONTEND_URL=https://your-frontend-url.vercel.app`

4. Deploy!

## CORS Configuration

The server automatically allows requests from:
- `localhost:3000` (development)
- `*.vercel.app` domains
- The specific `FRONTEND_URL` you configure

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **helmet**: Security middleware
- **morgan**: HTTP request logger
- **dotenv**: Environment variable loader
- **socket.io**: Real-time communication
- **moment**: Date/time manipulation