const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../lib/prisma');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const LANG_MAP = {
  'hi-IN': 'Hindi',
  'bn-IN': 'Bengali',
  'te-IN': 'Telugu',
  'ta-IN': 'Tamil',
  'mr-IN': 'Marathi',
  'gu-IN': 'Gujarati',
  'kn-IN': 'Kannada',
  'ml-IN': 'Malayalam',
  'pa-IN': 'Punjabi',
  'fr-FR': 'French',
  'de-DE': 'German',
  'es-ES': 'Spanish',
  'ar-SA': 'Arabic',
  'zh-CN': 'Chinese',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'pt-BR': 'Portuguese',
  'ru-RU': 'Russian',
  'en-US': 'English',
};

// Extra language-specific instructions so the model doesn't slip into English
const LANG_EXTRA = {
  'bn-IN': 'তুমি শুধুমাত্র বাংলায় উত্তর দেবে। ইংরেজিতে একটি শব্দও লিখবে না।',
  'hi-IN': 'आप केवल हिंदी में जवाब देंगे। एक भी अंग्रेजी शब्द मत लिखें।',
  'te-IN': 'మీరు తెలుగులో మాత్రమే సమాధానం ఇవ్వాలి.',
  'ta-IN': 'நீங்கள் தமிழில் மட்டுமே பதில் சொல்ல வேண்டும்.',
  'mr-IN': 'तुम्ही फक्त मराठीत उत्तर द्याल.',
  'gu-IN': 'તમે ફક્ત ગુજરાતીમાં જ જવાબ આપશો.',
  'kn-IN': 'ನೀವು ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸಬೇಕು.',
  'ml-IN': 'നിങ്ങൾ മലയാളത്തിൽ മാത്രം മറുപടി നൽകണം.',
  'pa-IN': 'ਤੁਸੀਂ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓਗੇ।',
};

exports.chat = async (req, res) => {
  try {
    const { question, language, history = [] } = req.body;

    if (!question) return res.status(400).json({ error: 'Question is required' });

    const medicines = await prisma.medicine.findMany({
      where: { userId: req.user.userId }
    });

    const today = new Date();

    const medicineList = medicines.length === 0
      ? 'No medicines added yet.'
      : medicines.map(med => {
          const daysLeft = Math.ceil(
            (new Date(med.expiryDate) - today) / (1000 * 60 * 60 * 24)
          );
          const status = daysLeft < 0
            ? 'EXPIRED'
            : daysLeft <= 30
            ? `expiring in ${daysLeft} days`
            : `good (${daysLeft} days left)`;
          return `- ${med.name} ${med.dosage || ''} | Qty: ${med.quantity} | Status: ${status}`;
        }).join('\n');

    const langName  = LANG_MAP[language]  || 'English';
    const langExtra = LANG_EXTRA[language] || '';
    const isEnglish = !language || language === 'en-US';

    // Build conversation history for context (last 6 exchanges max)
    const historyText = history.slice(-6).map(msg =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
    ).join('\n');

    const prompt = `You are MedTrack AI — a friendly medicine assistant.

═══════════════════════════════════════
LANGUAGE RULE — ABSOLUTE MANDATORY:
You MUST respond ENTIRELY in ${langName}.
${langExtra}
Medicine names (like Paracetamol, Aspirin) can stay in English.
ALL other words MUST be in ${langName}.
If ${langName} is not English, do NOT write any English sentences.
═══════════════════════════════════════

User's Medicine Cabinet (today: ${today.toDateString()}):
${medicineList}

${historyText ? `Recent conversation context:\n${historyText}\n` : ''}

User's current question: "${question}"

Instructions:
- Answer in ${langName} only
- Be warm, helpful, under 100 words
- Reference user's medicines by name when relevant  
- For serious health issues, advise consulting a doctor
- NEVER diagnose definitively`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer, medicineCount: medicines.length });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Could not get answer' });
  }
};