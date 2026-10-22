export const adminErrors:Record<string,string>={
  video_url:'Nhập link HTTPS YouTube hợp lệ (youtube.com/watch hoặc youtu.be).',
  login:'Mật khẩu không đúng. Vui lòng thử lại.',
  limited:'Đã thử quá nhiều lần. Vui lòng chờ một phút.',
  integration_input:'Khóa không hợp lệ. Nhập từ 8 đến 256 ký tự, không chứa khoảng trắng.',
  unpaid_order:'Đơn chưa được xác nhận thanh toán nên chưa thể gọi API.',
  missing_key:'Chưa cấu hình khóa NoDNS. Mở mục API NoDNS để cấu hình.',
  invalid_order:'Đơn không đủ điều kiện hoặc UID xác nhận không đúng.',
  already_completed:'Đơn đã hoàn tất. Hệ thống không gửi lại lệnh cấp.',
  invalid_package:'Gói của đơn không có mã API hợp lệ.',
  operation_locked:'Tài khoản có yêu cầu đang gửi hoặc chưa rõ kết quả. Kiểm tra lịch sử API trước khi gửi thêm.',
  operation_error:'Chưa hoàn tất thao tác. Kiểm tra lịch sử API trước khi gửi lại.',
  provider_rejected:'NoDNS từ chối yêu cầu. Xem mã kết quả trong lịch sử và kiểm tra cấu hình trước khi thử lại.',
  provider_unknown:'Chưa xác định được kết quả NoDNS. Không tự gửi lại; kiểm tra nhà cung cấp rồi ghi nhận kết quả đối chiếu trong lịch sử.',
  invalid_review:'Không thể ghi nhận. Chọn kết quả, nhập ghi chú ít nhất 10 ký tự và chờ yêu cầu đang gửi kết thúc.'
}
export const adminSuccess:Record<string,string>={created:'Đã tạo đơn hàng.',saved:'Đã lưu thay đổi.',integration_saved:'Đã lưu khóa kết nối phía máy chủ.',grant:'Đã ghi nhận xác nhận cấp Premium từ nhà cung cấp.',cancel:'Đã ghi nhận xác nhận thu hồi Premium. Thao tác không hoàn tiền.',reviewed:'Đã lưu kết quả đối chiếu thủ công.'}
