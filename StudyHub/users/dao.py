from datetime import date
from collections import Counter
from django.db.models.functions import ExtractMonth, ExtractYear
from courses import models

def last_5_months():
    """Trả về 5 tháng gần nhất, bao gồm tháng hiện tại"""
    today = date.today()
    year = today.year
    month = today.month
    months = []
    for i in range(4, -1, -1):  # 4 tháng trước -> tháng hiện tại
        m = month - i
        y = year
        if m <= 0:
            m += 12
            y -= 1
        months.append({"year": y, "month": m})
    return months

def user_dashboard_stats(user):
    """Lấy các thống kê cho user"""
    enrollments = models.Enrollment.objects.filter(user=user).select_related("course")

    # 1️⃣ Tổng số khóa học
    total_enrolled = enrollments.count()

    # 2️⃣ Danh sách khóa học đang theo dõi
    enrolled_courses = [
        {
            "id": e.course.id,
            "title": e.course.title,
            "thumbnail": e.course.thumbnail.url if e.course.thumbnail else None,
            "enrolled_at": e.enrolled_at
        }
        for e in enrollments
    ]

    months = last_5_months()
    month_keys = [(m["year"], m["month"]) for m in months]

    all_enrollments = models.Enrollment.objects.select_related("course")
    monthly_stats_dict = {}
    for e in all_enrollments:
        key = (e.enrolled_at.year, e.enrolled_at.month)
        if key in month_keys:
            monthly_stats_dict[key] = monthly_stats_dict.get(key, 0) + 1

    monthly_stats = [
        {
            "year": y,
            "month": m,
            "count": monthly_stats_dict.get((y, m), 0)
        }
        for y, m in month_keys
    ]

    # Khóa học được đăng ký nhiều nhất (tất cả user)
    course_counter = Counter(e.course.title for e in all_enrollments)
    top_course = course_counter.most_common(1)
    top_course_title = top_course[0][0] if top_course else None
    top_course_count = top_course[0][1] if top_course else 0


    return {
        "total_enrolled": total_enrolled,
        "enrolled_courses": enrolled_courses,
        "monthly_stats": monthly_stats,
        "top_course": {
            "title": top_course_title,
            "count": top_course_count
        }
    }
