export declare const dashboardService: {
    getOverview(period?: string): Promise<{
        cards: {
            instructors: {
                value: number;
                trend: string;
            };
            students: {
                value: number;
                trend: string;
            };
            courses: {
                value: number;
                trend: string;
            };
            enrollments: {
                value: number;
                trend: string;
            };
            revenue: {
                value: number;
                trend: string;
            };
        };
        enrollmentsTrends: {
            name: string;
            enrollments: number;
        }[];
        performanceTrends: {
            label: string;
            value: number;
            color: string;
        }[];
        recentEnrollments: ({
            student: {
                name: string;
                id: string;
                avatar: string | null;
            };
            course: {
                id: string;
                title: string;
                price: number;
            };
        } & {
            id: string;
            status: import("../../generated/prisma/index.js").$Enums.EnrollmentStatus;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            courseId: string;
            progress: number;
            contact: string | null;
            date: Date;
        })[];
    }>;
};
