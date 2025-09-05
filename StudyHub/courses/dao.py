from django.db.models import Count, Q, Sum
from django.db.models.functions import  ExtractYear, ExtractMonth
from datetime import date

from . import models


def load_courses(params={}):
    q = models.Course.objects.filter(active=True)

    kw = params.get('kw')
    if kw:
        q = q.filter(name__icontains=kw)

    cate_id = params.get('cate_id')
    if cate_id:
        q = q.filter(category_id=cate_id)

    return q

def count_courses_by_category():
    return models.Category.objects.annotate(count=Count('course')).values('id','name','count').order_by('-count')

def count_courses_by_tag():
    """
    Đếm số khóa học trong từng Tag
    """
    return models.Tag.objects.annotate(
        count=Count("course")
    ).values("id", "name", "count").order_by("-count")


def count_free_vs_paid_courses():
    """
    Thống kê số khóa học miễn phí và trả phí
    """
    return models.Course.objects.aggregate(
        free=Count("id", filter=Q(is_free=True)),
        paid=Count("id", filter=Q(is_free=False))
    )


def top_courses_by_students(limit=5):
    return models.Course.objects.annotate(
        student_count=Count('enrollments')  # enrollments là related_name trên Enrollment.course
    ).values('id', 'title', 'student_count').order_by('-student_count')[:limit]

from datetime import date

def last_5_months():
    today = date.today()
    year = today.year
    month = today.month

    months = []
    for i in range(4, -1, -1):  # 4 tháng trước -> tháng hiện tại
        m = month - i
        y = year
        if m <= 0:  # nếu vượt năm trước
            m += 12
            y -= 1
        months.append({"year": y, "month": m})
    return months

def count_courses_by_month():
    """
    Thống kê số khóa học được tạo theo tháng (chỉ 5 tháng gần nhất)
    """
    months = last_5_months()
    month_keys = [(m["year"], m["month"]) for m in months]
    # Lọc chỉ những tháng trong 5 tháng gần nhất
    courses = models.Course.objects.all()
    stats_dict = {}
    for c in courses:
        # Lấy year và month trực tiếp từ datetime Python
        key = (c.created_at.year, c.created_at.month)
        stats_dict[key] = stats_dict.get(key, 0) + 1
    result = []
    for y, m in month_keys:
        result.append({
            "year": y,
            "month": m,
            "count": stats_dict.get((y, m), 0)
        })
    return result


def revenue_per_course():
    courses = models.Course.objects.filter(is_free=False).values("id", "title", "price")
    # convert Decimal sang float
    return [
        {
            "id": c["id"],
            "title": c["title"],
            "revenue": float(c["price"])
        }
        for c in courses
    ]
def enrollment_by_month():
    """
    Thống kê số lượt đăng ký học theo tháng (chỉ 5 tháng gần nhất)
    """
    months = last_5_months()
    month_keys = [(m["year"], m["month"]) for m in months]

    enrollments = models.Enrollment.objects.all()
    stats_dict = {}
    for e in enrollments:
        key = (e.created_at.year, e.created_at.month)
        stats_dict[key] = stats_dict.get(key, 0) + 1

    result = []
    for y, m in month_keys:
        result.append({
            "year": y,
            "month": m,
            "count": stats_dict.get((y, m), 0)
        })
    return result