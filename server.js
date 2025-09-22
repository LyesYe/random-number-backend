const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());

// CORS configuration for production deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', // Local development
      process.env.FRONTEND_URL // Custom frontend URL from environment
    ].filter(Boolean);
    
    // Check if origin is from Vercel
    const isVercelDomain = origin.includes('.vercel.app') || origin.includes('.vercel.com');
    
    if (allowedOrigins.includes(origin) || isVercelDomain) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Backend API only - no static file serving

// Time-based random number generation function
function generateTimeBasedNumber() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    return (hour + minute + second) % 100;
}

// API Routes

// Root route - API information
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Random Number Backend API',
        version: '1.0.0',
        endpoints: {
            'GET /api/current-number': 'Get the current time-based random number',
            'POST /api/predict': 'Submit a prediction',
            'POST /api/log-access': 'Log frontend access',
            'GET /api/health': 'Health check endpoint'
        },
        documentation: 'Visit /api/health for server status'
    });
});

// Get current random number
app.get('/api/current-number', (req, res) => {
    try {
        const currentNumber = generateTimeBasedNumber();
        const now = new Date();
        
        res.json({
            success: true,
            data: {
                number: currentNumber,
                timestamp: now.toISOString(),
                formula: '(hour + minute + second) % 100',
                components: {
                    hour: now.getHours(),
                    minute: now.getMinutes(),
                    second: now.getSeconds()
                }
            }
        });
    } catch (error) {
        console.error('Error generating number:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate random number'
        });
    }
});

// Submit prediction
app.post('/api/predict', (req, res) => {
    try {
        const { prediction, sessionId } = req.body;
        
        if (typeof prediction !== 'number' || prediction < 0 || prediction > 99) {
            return res.status(400).json({
                success: false,
                error: 'Prediction must be a number between 0 and 99'
            });
        }
        
        const actualNumber = generateTimeBasedNumber();
        const isCorrect = prediction === actualNumber;
        const now = new Date();
        
        // Log the prediction attempt
        console.log(`Prediction attempt - Session: ${sessionId}, Predicted: ${prediction}, Actual: ${actualNumber}, Correct: ${isCorrect}`);
        
        res.json({
            success: true,
            data: {
                predicted: prediction,
                actual: actualNumber,
                correct: isCorrect,
                timestamp: now.toISOString(),
                sessionId: sessionId
            }
        });
    } catch (error) {
        console.error('Error processing prediction:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process prediction'
        });
    }
});

// Get system info
app.get('/api/system-info', (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                algorithm: 'Time-Based Pattern',
                formula: '(hour × minute + second) % 100',
                range: '0 - 99',
                updateFrequency: 'Every second',
                maxAttempts: 3,
                requiredCorrect: 3,
                serverTime: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error getting system info:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get system information'
        });
    }
});

// Log successful access
app.post('/api/log-access', (req, res) => {
    try {
        const { sessionId, attempts, userAgent, predictions } = req.body;
        
        const accessData = {
            sessionId,
            attempts,
            userAgent,
            predictions,
            timestamp: new Date().toISOString(),
            ip: req.ip || req.connection.remoteAddress
        };
        
        // Log to console
        console.log('ACCESS GRANTED:', JSON.stringify(accessData, null, 2));
        
        res.json({
            success: true,
            message: 'Access logged successfully',
            data: accessData
        });
    } catch (error) {
        console.error('Error logging access:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to log access'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Random Number Backend API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API-only backend - no catch-all route needed

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Random Number Backend API running on port ${PORT}`);
    console.log(`📊 Current time-based number: ${generateTimeBasedNumber()}`);
    console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});