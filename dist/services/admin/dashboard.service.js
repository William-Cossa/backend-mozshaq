import { prisma } from "../../lib/prisma.js";
export const dashboardService = {
    async getOverview(period = "30d") {
        const now = new Date();
        // Bounds for trends comparison calculation
        let currentPeriodStart;
        let previousPeriodStart;
        const daysMap = {
            "7d": 7,
            "30d": 30,
            "12m": 365,
        };
        if (period === "all") {
            currentPeriodStart = new Date(0);
            previousPeriodStart = new Date(0);
        }
        else {
            const days = daysMap[period] || 30;
            currentPeriodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
            previousPeriodStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);
        }
        // Basic Counts
        const [totalInstructors, totalStudents, totalCourses, totalEnrollments] = await Promise.all([
            prisma.instructor.count({ where: { status: "ACTIVO" } }),
            prisma.student.count(),
            prisma.course.count(),
            prisma.enrollment.count()
        ]);
        // Trends calculation for percentages
        const [instructorsLastMonth, studentsLastMonth, coursesLastMonth, enrollmentsLastMonth] = await Promise.all([
            prisma.instructor.count({ where: { status: "ACTIVO", createdAt: { lt: currentPeriodStart } } }),
            prisma.student.count({ where: { joinDate: { lt: currentPeriodStart } } }),
            prisma.course.count({ where: { createdAt: { lt: currentPeriodStart } } }),
            prisma.enrollment.count({ where: { createdAt: { lt: currentPeriodStart } } })
        ]);
        const calculateTrend = (current, past) => {
            if (past === 0)
                return current > 0 ? "+100%" : "0%";
            const increment = current - past;
            const percentage = (increment / past) * 100;
            return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
        };
        // Trends Data for Graph
        // Group payments by month roughly (simplified)
        const payments = await prisma.payment.findMany({
            where: {
                status: "APPROVED",
                approvedAt: period !== 'all' ? { not: null, gte: currentPeriodStart } : { not: null }
            },
            select: { amount: true, approvedAt: true }
        });
        let totalRevenue = 0;
        const revenueByMonth = {};
        payments.forEach((p) => {
            totalRevenue += p.amount;
            const m = p.approvedAt.toLocaleString('pt-MZ', { month: 'short' });
            revenueByMonth[m] = (revenueByMonth[m] || 0) + p.amount;
        });
        const performanceTrends = Object.entries(revenueByMonth).map(([label, value], i) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1),
            value: value,
            color: i % 2 === 0 ? "#0d9488" : "#f59e0b" // Teal and Amber
        }));
        // Enrollments Trends
        const enrollments = await prisma.enrollment.findMany({
            where: period !== 'all' ? { createdAt: { gte: currentPeriodStart } } : {},
            select: { createdAt: true }
        });
        const enrollmentsByMonth = {};
        enrollments.forEach((e) => {
            const m = e.createdAt.toLocaleString('pt-MZ', { month: 'short' });
            enrollmentsByMonth[m] = (enrollmentsByMonth[m] || 0) + 1;
        });
        const enrollmentsTrends = Object.entries(enrollmentsByMonth).map(([name, val]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            enrollments: val
        }));
        // Recent Enrollments
        const recentEnrollments = await prisma.enrollment.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                student: { select: { id: true, name: true, avatar: true } },
                course: { select: { id: true, title: true, price: true } }
            }
        });
        return {
            cards: {
                instructors: { value: totalInstructors, trend: calculateTrend(totalInstructors, instructorsLastMonth) },
                students: { value: totalStudents, trend: calculateTrend(totalStudents, studentsLastMonth) },
                courses: { value: totalCourses, trend: calculateTrend(totalCourses, coursesLastMonth) },
                enrollments: { value: totalEnrollments, trend: calculateTrend(totalEnrollments, enrollmentsLastMonth) },
                revenue: { value: totalRevenue, trend: "0%" }
            },
            enrollmentsTrends: enrollmentsTrends.length > 0 ? enrollmentsTrends : [{ name: "Actual", enrollments: 0 }],
            performanceTrends: performanceTrends.length > 0 ? performanceTrends : [{ label: "Actual", value: 0, color: "#0d9488" }],
            recentEnrollments
        };
    }
};
