
const express = require('express');
const router = express.Router();
const { updateSessionStatus, getStatistics } = require('../controllers/statController');
const auth = require('../middleware/auth');

// PUT /api/statistics/sessions/:sessionId/status - تحديث حالة الجلسة
router.put('/sessions/:sessionId/status', auth, updateSessionStatus);

// GET /api/statistics - جلب كل الإحصائيات
router.get('/', auth, getStatistics);

module.exports = router;