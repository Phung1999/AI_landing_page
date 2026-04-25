"""
Fallback Landing Page Generator
Tự sinh landing page khi không có OpenAI API key hoặc khi gọi API thất bại.
Dựa trên loại landing page và mô tả của người dùng để tạo nội dung phù hợp.
"""

import uuid
from typing import Optional


def generate_fallback_sections(landing_type: str, description: str) -> list[dict]:
    """
    Sinh ra danh sách sections cho landing page dựa trên loại và mô tả.
    """
    generators = {
        "course": _generate_course_sections,
        "saas": _generate_saas_sections,
        "product": _generate_product_sections,
    }

    generator = generators.get(landing_type, _generate_product_sections)
    return generator(description)


def _make_section(section_type: str, props: dict) -> dict:
    return {
        "id": str(uuid.uuid4()),
        "type": section_type,
        "props": props,
    }


def _extract_keyword(description: str) -> str:
    """Trích xuất keyword chính từ mô tả để cá nhân hóa nội dung."""
    # Lấy phần đầu mô tả làm keyword
    words = description.strip().split()
    if len(words) <= 5:
        return description.strip()
    return " ".join(words[:6]) + "..."


def _generate_course_sections(description: str) -> list[dict]:
    keyword = _extract_keyword(description)
    return [
        _make_section("hero", {
            "title": f"Khóa Học Chuyên Sâu — {keyword}",
            "subtitle": f"Khám phá lộ trình học tập được thiết kế riêng cho bạn. {description[:120]}",
            "cta": "Đăng Ký Ngay",
            "ctaLink": "#pricing",
        }),
        _make_section("features", {
            "items": [
                {
                    "icon": "award",
                    "title": "Giảng viên hàng đầu",
                    "description": "Được dẫn dắt bởi những chuyên gia có nhiều năm kinh nghiệm thực chiến trong ngành."
                },
                {
                    "icon": "users",
                    "title": "Cộng đồng hỗ trợ",
                    "description": "Tham gia cộng đồng hàng nghìn học viên, cùng nhau phát triển và chia sẻ kiến thức."
                },
                {
                    "icon": "zap",
                    "title": "Học mọi lúc mọi nơi",
                    "description": "Truy cập bài giảng trọn đời trên mọi thiết bị — máy tính, tablet hay điện thoại."
                },
            ]
        }),
        _make_section("testimonials", {
            "items": [
                {
                    "name": "Nguyễn Minh Anh",
                    "content": "Khóa học thay đổi hoàn toàn cách tôi nhìn nhận vấn đề. Nội dung thực tế, dễ áp dụng ngay.",
                    "rating": 5
                },
                {
                    "name": "Trần Đức Huy",
                    "content": "Giảng viên rất tâm huyết, giải đáp thắc mắc nhanh chóng. Đáng đồng tiền bát gạo!",
                    "rating": 5
                },
                {
                    "name": "Lê Thị Hương",
                    "content": "Sau 2 tháng học, tôi đã tự tin áp dụng vào công việc thực tế. Kết quả vượt mong đợi.",
                    "rating": 5
                },
            ]
        }),
        _make_section("pricing", {
            "plans": [
                {
                    "name": "Cơ bản",
                    "price": "499K",
                    "features": [
                        "Truy cập toàn bộ video bài giảng",
                        "Tài liệu PDF đi kèm",
                        "Cập nhật nội dung 6 tháng",
                        "Hỗ trợ qua email",
                    ],
                    "cta": "Bắt đầu học",
                    "highlight": False,
                },
                {
                    "name": "Premium",
                    "price": "1.299K",
                    "features": [
                        "Tất cả tính năng Cơ bản",
                        "Mentoring 1-1 hàng tuần",
                        "Chứng chỉ hoàn thành",
                        "Cập nhật nội dung trọn đời",
                        "Nhóm học tập riêng",
                    ],
                    "cta": "Đăng ký Premium",
                    "highlight": True,
                },
            ]
        }),
        _make_section("cta", {
            "title": "Sẵn sàng nâng cấp bản thân?",
            "description": "Hàng nghìn học viên đã bắt đầu hành trình của họ. Đừng bỏ lỡ cơ hội thay đổi cuộc sống!",
            "buttonText": "Đăng Ký Ngay Hôm Nay",
        }),
        _make_section("footer", {
            "links": [
                {"label": "Về chúng tôi", "href": "#"},
                {"label": "Khóa học", "href": "#"},
                {"label": "Blog", "href": "#"},
                {"label": "Liên hệ", "href": "#"},
                {"label": "Chính sách", "href": "#"},
            ]
        }),
    ]


def _generate_saas_sections(description: str) -> list[dict]:
    keyword = _extract_keyword(description)
    return [
        _make_section("hero", {
            "title": f"Giải Pháp Thông Minh — {keyword}",
            "subtitle": f"Nền tảng công nghệ giúp bạn tối ưu hóa quy trình làm việc. {description[:120]}",
            "cta": "Dùng Thử Miễn Phí",
            "ctaLink": "#pricing",
        }),
        _make_section("features", {
            "items": [
                {
                    "icon": "zap",
                    "title": "Tốc độ vượt trội",
                    "description": "Xử lý nhanh gấp 10 lần phương pháp truyền thống nhờ công nghệ AI tiên tiến."
                },
                {
                    "icon": "shield",
                    "title": "Bảo mật tuyệt đối",
                    "description": "Dữ liệu được mã hóa end-to-end, tuân thủ tiêu chuẩn bảo mật quốc tế ISO 27001."
                },
                {
                    "icon": "headphones",
                    "title": "Hỗ trợ 24/7",
                    "description": "Đội ngũ support chuyên nghiệp luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi."
                },
            ]
        }),
        _make_section("testimonials", {
            "items": [
                {
                    "name": "CEO, Công ty ABC Tech",
                    "content": "Giải pháp này giúp chúng tôi tiết kiệm 40% thời gian vận hành. ROI đạt được sau chỉ 2 tháng sử dụng.",
                    "rating": 5
                },
                {
                    "name": "CTO, Startup XYZ",
                    "content": "Tích hợp API cực kỳ mượt mà. Team dev của chúng tôi setup xong chỉ trong 1 ngày.",
                    "rating": 5
                },
                {
                    "name": "Product Manager, Corp 123",
                    "content": "Dashboard trực quan, dễ sử dụng. Cả team non-tech cũng có thể tự vận hành được.",
                    "rating": 5
                },
            ]
        }),
        _make_section("pricing", {
            "plans": [
                {
                    "name": "Starter",
                    "price": "Miễn phí",
                    "features": [
                        "Lên đến 1.000 requests/tháng",
                        "1 workspace",
                        "Community support",
                        "Basic analytics",
                    ],
                    "cta": "Bắt đầu miễn phí",
                    "highlight": False,
                },
                {
                    "name": "Business",
                    "price": "999K",
                    "features": [
                        "Unlimited requests",
                        "10 workspaces",
                        "Priority support 24/7",
                        "Advanced analytics & API",
                        "Custom integrations",
                    ],
                    "cta": "Nâng cấp ngay",
                    "highlight": True,
                },
            ]
        }),
        _make_section("cta", {
            "title": "Bắt đầu miễn phí ngay hôm nay",
            "description": "Không cần thẻ tín dụng. Setup trong 5 phút. Hủy bất cứ lúc nào.",
            "buttonText": "Tạo Tài Khoản Miễn Phí",
        }),
        _make_section("footer", {
            "links": [
                {"label": "Sản phẩm", "href": "#"},
                {"label": "Bảng giá", "href": "#"},
                {"label": "API Docs", "href": "#"},
                {"label": "Blog", "href": "#"},
                {"label": "Liên hệ", "href": "#"},
            ]
        }),
    ]


def _generate_product_sections(description: str) -> list[dict]:
    keyword = _extract_keyword(description)
    return [
        _make_section("hero", {
            "title": f"Khám Phá Sản Phẩm — {keyword}",
            "subtitle": f"Sản phẩm chất lượng cao, được thiết kế tỉ mỉ cho trải nghiệm tốt nhất. {description[:120]}",
            "cta": "Mua Ngay",
            "ctaLink": "#pricing",
        }),
        _make_section("features", {
            "items": [
                {
                    "icon": "check",
                    "title": "Chất lượng cam kết",
                    "description": "Sản phẩm trải qua quy trình kiểm tra nghiêm ngặt, đảm bảo chất lượng tốt nhất."
                },
                {
                    "icon": "truck",
                    "title": "Giao hàng nhanh chóng",
                    "description": "Miễn phí vận chuyển toàn quốc. Giao hàng trong 24-48h cho khu vực nội thành."
                },
                {
                    "icon": "rotate-ccw",
                    "title": "Đổi trả dễ dàng",
                    "description": "Chính sách đổi trả trong 30 ngày. Hoàn tiền 100% nếu không hài lòng."
                },
            ]
        }),
        _make_section("testimonials", {
            "items": [
                {
                    "name": "Phạm Văn Đức",
                    "content": "Sản phẩm chất lượng vượt xa mong đợi. Đóng gói cẩn thận, giao hàng nhanh. Sẽ quay lại mua tiếp!",
                    "rating": 5
                },
                {
                    "name": "Hoàng Thị Mai",
                    "content": "Đã mua lần thứ 3 rồi. Chất lượng ổn định, giá cả hợp lý. Rất đáng để thử!",
                    "rating": 5
                },
                {
                    "name": "Vũ Quang Minh",
                    "content": "Dịch vụ chăm sóc khách hàng tuyệt vời. Được tư vấn nhiệt tình, giải đáp mọi thắc mắc.",
                    "rating": 5
                },
            ]
        }),
        _make_section("pricing", {
            "plans": [
                {
                    "name": "Tiêu chuẩn",
                    "price": "599K",
                    "features": [
                        "Sản phẩm chính hãng 100%",
                        "Bảo hành 12 tháng",
                        "Miễn phí vận chuyển",
                        "Hỗ trợ kỹ thuật",
                    ],
                    "cta": "Chọn mua",
                    "highlight": False,
                },
                {
                    "name": "Combo ưu đãi",
                    "price": "999K",
                    "features": [
                        "Tất cả tính năng Tiêu chuẩn",
                        "Tặng phụ kiện cao cấp",
                        "Bảo hành 24 tháng",
                        "Ưu tiên hỗ trợ VIP",
                        "Giảm 15% đơn tiếp theo",
                    ],
                    "cta": "Mua combo ngay",
                    "highlight": True,
                },
            ]
        }),
        _make_section("cta", {
            "title": "Đặt hàng ngay — Ưu đãi có hạn!",
            "description": "Số lượng có hạn. Đặt hàng hôm nay để nhận ưu đãi giảm giá 20% và quà tặng đặc biệt.",
            "buttonText": "Đặt Hàng Ngay",
        }),
        _make_section("footer", {
            "links": [
                {"label": "Sản phẩm", "href": "#"},
                {"label": "Về chúng tôi", "href": "#"},
                {"label": "Chính sách đổi trả", "href": "#"},
                {"label": "Liên hệ", "href": "#"},
                {"label": "FAQ", "href": "#"},
            ]
        }),
    ]
