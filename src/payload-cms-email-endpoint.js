export const sendEmailHandler = async (req, res) => {
  console.log('Email endpoint hit:', req.body)
  res.status(200).json({ success: true, message: 'Endpoint working!' })
}
