# API Configuration Guide

This form submits data to a backend API endpoint. You'll need to configure your backend to receive and process the form submissions.

## Endpoint Configuration

The form is currently configured to POST to `/api/contact`. You can modify this in `src/App.tsx`:

```typescript
const response = await fetch("/api/contact", {  // Change this URL
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // Add any authentication headers here if needed
    // "Authorization": "Bearer YOUR_TOKEN",
  },
  body: JSON.stringify(formData),
})
```

## Request Format

The form sends a JSON payload with the following structure:

```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "phone": "76 464 42 90",
  "interests": ["Consulting", "Formation"],
  "services": ["Audit financier", "Conseil stratégique"],
  "modules": ["Comptabilité fondamentale", "Analyse financière"],
  "message": "Je souhaiterais plus d'informations sur vos services de consulting..."
}
```

### Field Descriptions

- `name` (string): Full name, required, minimum 2 characters
- `email` (string): Email address, required, validated format
- `phone` (string): Phone number, optional, 8-15 digits if provided
- `interests` (array): At least one of ["Consulting", "Formation"]
- `services` (array): Selected consulting services (only if Consulting interest selected)
- `modules` (array): Selected training modules (only if Formation interest selected)
- `message` (string): Optional message, 10-1000 characters if provided

## Expected Response Format

### Success Response (2xx)

Any 2xx status code will trigger the success screen. Optionally return JSON:

```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "id": "12345"
}
```

### Error Response (4xx/5xx)

Return a JSON object with a `message` field for user-friendly error display:

```json
{
  "success": false,
  "message": "Unable to process your request. Please try again."
}
```

If no `message` field is provided, a generic error message will be shown.

## Example Backend Implementations

### Node.js + Express

```javascript
app.post('/api/contact', express.json(), async (req, res) => {
  try {
    const { name, email, phone, interests, services, modules, message } = req.body;
    
    // Validate required fields
    if (!name || !email || interests.length === 0) {
      return res.status(400).json({
        message: "Champs requis manquants"
      });
    }
    
    // Process the form data (e.g., save to database, send email, etc.)
    // ... your business logic here ...
    
    res.status(200).json({
      success: true,
      message: "Formulaire reçu avec succès",
      id: "generated-id"
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      message: "Erreur serveur. Veuillez réessayer."
    });
  }
});
```

### Python + Flask

```python
from flask import Flask, request, jsonify

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('interests'):
            return jsonify({
                'message': 'Champs requis manquants'
            }), 400
        
        # Process the form data
        # ... your business logic here ...
        
        return jsonify({
            'success': True,
            'message': 'Formulaire reçu avec succès',
            'id': 'generated-id'
        }), 200
        
    except Exception as e:
        print(f'Error processing contact form: {e}')
        return jsonify({
            'message': 'Erreur serveur. Veuillez réessayer.'
        }), 500
```

## Testing Without a Backend

For testing purposes, you can use a mock API service:

1. **JSONPlaceholder** (always returns success):
   - Change endpoint to: `https://jsonplaceholder.typicode.com/posts`

2. **RequestBin** (inspect requests):
   - Create a bin at https://requestbin.com
   - Use your unique bin URL as the endpoint

3. **Local Mock Server**:
   - Create a simple local server that logs requests and returns success

## Adding Authentication

If your API requires authentication, add headers in the fetch call:

```typescript
const response = await fetch("/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${YOUR_AUTH_TOKEN}`,
    "X-API-Key": YOUR_API_KEY,
  },
  body: JSON.stringify(formData),
})
```

## CORS Configuration

If your API is on a different domain, ensure CORS is properly configured:

**Express example:**
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Production Considerations

1. **Rate Limiting**: Implement rate limiting to prevent spam
2. **Validation**: Always validate on the server side, don't trust client validation
3. **Sanitization**: Sanitize input to prevent injection attacks
4. **Email Notifications**: Configure email service to notify your team of new submissions
5. **Database Storage**: Store submissions for follow-up and analytics
6. **Error Logging**: Log errors for debugging and monitoring
7. **HTTPS**: Always use HTTPS in production
