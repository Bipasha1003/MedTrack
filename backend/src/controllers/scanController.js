const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');

// Connect to Gemini AI using your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Setup image upload handler
// memoryStorage means image stays in RAM temporarily
// not saved to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // accept image
    } else {
      cb(new Error('Only images allowed')); // reject non-image
    }
  }
});

// This runs before scanMedicine to handle the file upload
exports.uploadMiddleware = upload.single('image');

// Main scan function
exports.scanMedicine = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Convert image to base64 — Gemini needs this format
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Use Gemini vision model — can read images
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Send image + instructions to Gemini
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      },
      `You are a medicine label reader.
       Look at this medicine packaging carefully.
       Extract details and return ONLY a JSON object.
       No explanation. Just JSON.
       
       Format:
       {
         "name": "medicine name",
         "dosage": "like 500mg or null",
         "category": "tablet or syrup or cream or injection or other",
         "expiryDate": "YYYY-MM-DD or null",
         "manufacturer": "company name or null"
       }
       
       If expiry shows 08/2026 convert to 2026-08-01
       If field not found use null
       Return ONLY the JSON`
    ]);

    // Get Gemini's response text
    const responseText = result.response.text().trim();

    // Remove markdown formatting if Gemini adds it
    const cleaned = responseText.replace(/```json|```/g, '').trim();

    // Convert text to JavaScript object
    const parsedData = JSON.parse(cleaned);

    res.json({
      success: true,
      parsedData,
      message: 'Review and confirm the details'
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      error: 'Could not scan image: ' + error.message
    });
  }
};