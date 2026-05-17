// controllers/statisticsController.js
const StudySession = require('../models/StudySession');

//Update session state
exports.updateSessionStatus = async (req, res) => {
    try {
        const { sessionId, status } = req.body;
        const userId = req.user.id;

        const session = await StudySession.findOne({ _id: sessionId, userId });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.status = status;
        await session.save();

        res.json({ success: true, session });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get statistics with data course
exports.getStatistics = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get Sessions with whole data Course
        const sessions = await StudySession.find({ userId }).populate('courseId');
        
        // 
        const totalSessions = sessions.length;
        const completedSessions = sessions.filter(s => s.status === 'completed').length;
        const missedSessions = sessions.filter(s => s.status === 'missed').length;
        
        const totalStudyHours = sessions
            .filter(s => s.status === 'completed')
            .reduce((sum, s) => sum + s.duration, 0);
        
        const completionRate = totalSessions > 0 
            ? Math.round((completedSessions / totalSessions) * 100) 
            : 0;
        
        //  course Distribution (باستخدام populate)
        const courseDistribution = {};
        sessions.forEach(session => {
            if (session.status === 'completed' && session.courseId) {
                const courseName = session.courseId.courseName;
                courseDistribution[courseName] = (courseDistribution[courseName] || 0) + session.duration;
            }
        });
        
        // Course Progress (باستخدام populate)
        const courseProgress = {};
        sessions.forEach(session => {
            if (!session.courseId) return;
            const courseName = session.courseId.courseName;
            if (!courseProgress[courseName]) {
                courseProgress[courseName] = { completed: 0, missed: 0, hours: 0 };
            }
            if (session.status === 'completed') {
                courseProgress[courseName].completed++;
                courseProgress[courseName].hours += session.duration;
            } else if (session.status === 'missed') {
                courseProgress[courseName].missed++;
            }
        });
        
        const courseProgressArray = Object.entries(courseProgress).map(([course, stats]) => {
            const total = stats.completed + stats.missed;
            const rate = total > 0 ? Math.round((stats.completed / total) * 100) : 0;
            return { course, ...stats, completionRate: rate };
        });
        
        res.json({
            success: true,
            data: {
                totalStudyHours,
                completedSessions,
                missedSessions,
                totalSessions,
                completionRate,
                courseDistribution: Object.entries(courseDistribution).map(([course, hours]) => ({ course, hours })),
                courseProgress: courseProgressArray
            }
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};