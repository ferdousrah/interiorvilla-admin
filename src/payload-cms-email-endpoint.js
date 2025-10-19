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

    const { type, name, email, mobile, address, subject, message } = req.body || {}

    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (!RESEND_API_KEY) {
      return res.status(500).json({
        error: 'RESEND_API_KEY not configured in environment variables',
      })
    }

    let emailSubject = ''
    let emailHtml = ''

    if (type === 'appointment') {
      emailSubject = 'New Appointment Request - Interior Villa'
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #75BF44; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Appointment Request</h1>
          </div>
          <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px;">
            <h2 style="color: #333; border-bottom: 2px solid #75BF44; padding-bottom: 10px;">Client Details</h2>
            <table style="width: 100%; margin-top: 20px;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Mobile:</td>
                <td style="padding: 10px 0; color: #333;">${mobile}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Address:</td>
                <td style="padding: 10px 0; color: #333;">${address}</td>
              </tr>
            </table>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated message from Interior Villa BD website.</p>
          </div>
        </div>
      `
    } else if (type === 'contact') {
      emailSubject = subject || 'New Contact Form Submission - Interior Villa'
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #75BF44; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Message</h1>
          </div>
          <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px;">
            <h2 style="color: #333; border-bottom: 2px solid #75BF44; padding-bottom: 10px;">Contact Details</h2>
            <table style="width: 100%; margin-top: 20px;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; color: #333;">${email}</td>
              </tr>
              ${
                mobile
                  ? `
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Mobile:</td>
                <td style="padding: 10px 0; color: #333;">${mobile}</td>
              </tr>
              `
                  : ''
              }
            </table>
            <div style="margin-top: 30px;">
              <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
              <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #75BF44; border-radius: 3px;">
                <p style="color: #333; line-height: 1.6; margin: 0;">${message}</p>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated message from Interior Villa BD website.</p>
          </div>
        </div>
      `
    } else {
      return res.status(400).json({
        error: "Invalid request: type field must be 'appointment' or 'contact'",
      })
    }

    // Use fetch instead of axios for better compatibility
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Interior Villa <onboarding@resend.dev>',
        to: ['bdtechnocrats@gmail.com'],
        subject: emailSubject,
        html: emailHtml,
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', responseData)
      return res.status(response.status).json({
        error: responseData.message || 'Failed to send email',
        details: responseData,
      })
    }

    console.log('Email sent successfully:', responseData)

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: responseData,
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
