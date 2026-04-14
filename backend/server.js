const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbMain = new AWS.DynamoDB();
const TABLE_NAME = 'Todos';

// Middleware
app.use(cors());
app.use(express.json());

// Create table if it doesn't exist
const createTableIfNotExists = async () => {
  try {
    const params = {
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    };

    await dynamodbMain.createTable(params).promise();
    console.log('✓ Table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('✓ Table already exists');
    } else {
      console.error('Error creating table:', error.message);
    }
  }
};

// Initialize table on startup
createTableIfNotExists();

console.log('✓ AWS DynamoDB Configured');

// ====== GET ALL TODOS ======
app.get('/api/todos', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };
    const result = await dynamodb.scan(params).promise();
    
    // Sort by creation date (newest first)
    const todos = result.Items.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json({ success: true, data: todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ====== GET SINGLE TODO ======
app.get('/api/todos/:id', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    };
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: result.Item });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ====== CREATE TODO ======
app.post('/api/todos', async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const { v4: uuid } = require('uuid');
    const newTodo = {
      id: uuid(),
      title: req.body.title,
      description: req.body.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: TABLE_NAME,
      Item: newTodo
    };

    await dynamodb.put(params).promise();
    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ====== UPDATE TODO ======
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updateExpression = [];
    const expressionAttributeValues = {};

    if (req.body.title !== undefined) {
      updateExpression.push('title = :title');
      expressionAttributeValues[':title'] = req.body.title;
    }
    if (req.body.description !== undefined) {
      updateExpression.push('description = :description');
      expressionAttributeValues[':description'] = req.body.description;
    }
    if (req.body.completed !== undefined) {
      updateExpression.push('completed = :completed');
      expressionAttributeValues[':completed'] = req.body.completed;
    }

    updateExpression.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id },
      UpdateExpression: 'SET ' + updateExpression.join(', '),
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();
    if (!result.Attributes) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: result.Attributes });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ====== DELETE TODO ======
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    };
    await dynamodb.delete(params).promise();
    res.json({ success: true, message: 'Todo deleted' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✓ Todo API running with AWS DynamoDB' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log('✓ Connected to AWS DynamoDB');
});
