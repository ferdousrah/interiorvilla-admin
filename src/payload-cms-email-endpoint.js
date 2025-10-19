/**
 * Payload CMS Custom Endpoint for Email Sending
 *
 * Add this to your Payload CMS project in one of these ways:
 *
 * Option 1: As a custom endpoint in payload.config.js:
 *
 * export default buildConfig({
 *   // ... other config
 *   endpoints: [
 *     {
 *       path: '/send-email',
 *       method: 'post',
 *       handler: async (req, res) => {
 *         // Copy the handler function below
 *       }
 *     }
 *   ]
 * })
 *
 * Option 2: As a separate route file in your Express app
 */

// Use node-fetch or native fetch instead of axios for better compatibility
export const sendEmailHandler = async (req, res) => {
  try {
    // Log the request for debugging
    console.log('Email endpoint hit:', {
      body: req.body,
      hasBody: !!req.body,
      contentType: req.headers['content-type'],
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return res.status(500).json({
      error: error.message || 'Failed to send email',
      details:
        process.env.NODE_ENV === 'development'
          ? {
              message: error.message,
              stack: error.stack,
            }
          : undefined,
    })
  }
}

/**
 * SETUP INSTRUCTIONS FOR PAYLOAD CMS:
 *
 * 1. Open your payload.config.js or payload.config.ts file
 *
 * 2. Import this handler at the top:
 *    import { sendEmailHandler } from './path/to/this/file'
 *
 * 3. Add the endpoint to your config:
 *
 *    export default buildConfig({
 *      // ... other config
 *      endpoints: [
 *        {
 *          path: '/send-email',
 *          method: 'post',
 *          handler: sendEmailHandler
 *        }
 *      ]
 *    })
 *
 * 4. No additional packages needed - uses native fetch API
 *
 * 5. Add RESEND_API_KEY to your .env file in Payload CMS:
 *    RESEND_API_KEY=re_your_api_key_here
 *
 * 6. The endpoint will be available at:
 *    https://cms.interiorvillabd.com/api/send-email
 *
 *    Which through your nginx proxy will be accessible at:
 *    https://interiorvillabd.com/api/send-email
 *
 * 7. Restart your Payload CMS server after making these changes
 */
