# Cổng đăng ký hoạt động phong trào - CĐNNNB

Bộ khung frontend ban đầu cho:
ĐOÀN THANH NIÊN TRƯỜNG CAO ĐẲNG NÔNG NGHIỆP NAM BỘ

## Chạy thử
Mở `index.html` bằng trình duyệt.

## Đã có
- Trang chủ 7 hoạt động
- Giao diện responsive
- Form động
- Chi đoàn đăng ký
- Trưởng nhóm
- Thành viên + nút "Thêm thành viên"
- Giới tính cho thành viên
- Luật số lượng mẫu cho Kéo co / Nhảy bao bố / Cắm hoa / Chuyền nước
- Form Hội diễn văn nghệ: 1 lần gửi = 1 tiết mục
- Link beat nhạc
- Khung Xem danh sách

## Bước tiếp theo
Nối `app.js` với Google Apps Script Web App để ghi/đọc Google Sheets.


V2 UPDATE:
- Trưởng nhóm có thêm Giới tính (bắt buộc).
- Các trường bắt buộc được kiểm tra trước khi submit.
- Thành viên tối thiểu được kiểm tra theo từng hoạt động.
- Thành viên được thêm bằng nút 'Thêm thành viên' nếu đã tạo block thì phải nhập đầy đủ.
- Kéo co/Nhảy bao bố có kiểm tra cơ cấu Nam/Nữ.


V3 - GOOGLE SHEETS CONNECTED:
- API URL đã được gắn vào app.js.
- Nút ĐĂNG KÝ gửi dữ liệu thật tới Google Apps Script.
- Có mã đăng ký và thời gian do Apps Script tạo.
- Có danh sách đăng ký đọc từ Google Sheets.
- Văn nghệ: mỗi lần đăng ký là một tiết mục; có nút đăng ký thêm tiết mục.
- Lưu ý: nếu trình duyệt báo lỗi khi gửi/đọc dữ liệu, kiểm tra lại Apps Script deployment và quyền "Bất kỳ ai".
API: https://script.google.com/macros/s/AKfycbwlfzJDLY7lyYw61brsj4HuKrcFI6bl9ZeseVCx057xq7_VekH2RHo1Ev6j4jRTzzd8eQ/exec
