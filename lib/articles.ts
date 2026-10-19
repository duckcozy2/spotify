import {salesArticles} from './sales-articles'
export type Article = {
  slug: string
  title: string
  description: string
  category: string
  sections: {id: string; title: string; paragraphs: string[]; steps?: string[]}[]
  source: {title: string; url: string}
}

export const articles: Article[] = [
  ...salesArticles,
  {
    slug: 'cach-tai-nhac-spotify-nghe-offline', category: 'Hướng dẫn',
    title: 'Cách tải nhạc Spotify để nghe offline trên điện thoại',
    description: 'Hướng dẫn tải playlist Spotify để nghe ngoại tuyến, chuẩn bị trước chuyến đi và xử lý khi nhạc đã tải không phát được.',
    sections: [
      {id: 'chuan-bi', title: 'Chuẩn bị trước khi tải nhạc', paragraphs: ['Premium hỗ trợ tải nhạc để nghe ngoại tuyến trong ứng dụng Spotify. Hãy kiểm tra tài khoản đang đăng nhập, dung lượng trống và kết nối mạng trước khi tải. Đây là nội dung dùng trong ứng dụng, không phải tệp MP3 để xuất sang trình nghe nhạc khác.', 'Nếu chuẩn bị đi xa, nên chọn trước những album hoặc playlist thực sự muốn nghe. Một danh sách vừa đủ sẽ dễ kiểm tra hơn việc tải toàn bộ thư viện rồi mới phát hiện máy thiếu dung lượng.']},
      {id: 'thuc-hien', title: 'Tải playlist và kiểm tra trước khi đi', paragraphs: ['Đợi quá trình tải hoàn tất trước khi ngắt mạng. Tên nút có thể khác theo phiên bản ứng dụng.'], steps: ['Mở Spotify và chọn album hoặc playlist cần nghe.', 'Bật nút tải xuống và chờ nội dung tải xong.', 'Thử tắt mạng rồi mở lại playlist để kiểm tra.', 'Nếu cần, bật chế độ ngoại tuyến trong cài đặt ứng dụng.']},
      {id: 'khac-phuc', title: 'Nhạc đã tải nhưng không nghe được thì làm gì?', paragraphs: ['Kiểm tra đúng tài khoản, trạng thái gói và nội dung đã tải. Spotify yêu cầu kết nối lại định kỳ để duy trì bản tải; cài lại ứng dụng có thể khiến bạn phải tải lại nội dung.', 'Đừng vội cài lại ứng dụng khi đang ở nơi không có Wi-Fi. Hãy ghi lại playlist gặp lỗi, thử một playlist khác và xử lý khi có mạng ổn định. Cách này giúp tránh mất thêm các bản tải đang dùng được.']},
    ], source: {title: 'Spotify: Nghe nhạc không cần kết nối mạng', url: 'https://support.spotify.com/vn-vi/article/listen-offline/'},
  },
  {
    slug: 'cach-bat-chat-luong-am-thanh-rat-cao-spotify', category: 'Mẹo sử dụng',
    title: 'Cách bật chất lượng âm thanh Rất cao trên Spotify',
    description: 'Tìm cài đặt chất lượng âm thanh Spotify, phân biệt phát trực tuyến với tải xuống và chọn mức phù hợp khi dùng Wi-Fi hoặc 4G.',
    sections: [
      {id: 'lua-chon', title: 'Chất lượng Rất cao phù hợp khi nào?', paragraphs: ['Spotify cung cấp mức chất lượng theo gói và thiết bị. Trong ứng dụng, Premium có lựa chọn Rất cao; trình phát web có cách xử lý riêng. Vì vậy, đừng dùng giao diện web để tìm một nút chỉ có trong ứng dụng.', 'Nếu thường nghe bằng tai nghe tại nhà, bạn có thể thử cùng một bài ở hai mức và chọn mức phù hợp. Môi trường nghe, tai nghe và kết nối đều ảnh hưởng đến trải nghiệm; con số chất lượng không phải yếu tố duy nhất.']},
      {id: 'cai-dat', title: 'Đổi cài đặt trong ứng dụng', paragraphs: ['Mức phát trực tuyến và mức tải xuống được quản lý riêng. Hãy kiểm tra cả hai nếu bạn nghe nhạc theo cả hai cách.'], steps: ['Mở ảnh đại diện, tìm Cài đặt và quyền riêng tư.', 'Vào phần Chất lượng âm thanh.', 'Chọn mức mong muốn cho Wi-Fi và dữ liệu di động.', 'Kiểm tra chất lượng tải xuống nếu thường nghe offline.']},
      {id: 'du-lieu', title: 'Cân bằng chất lượng, dữ liệu và dung lượng', paragraphs: ['Chất lượng cao hơn sử dụng nhiều dữ liệu và dung lượng hơn. Nếu mạng yếu, chế độ tự động có thể giúp hạn chế gián đoạn.', 'Một cách sắp xếp dễ nhớ là ưu tiên chất lượng cao trên Wi-Fi, dùng mức tiết kiệm khi đi đường và chỉ tải các playlist yêu thích. Nếu không thấy tùy chọn mong muốn, kiểm tra gói, phiên bản ứng dụng và thiết bị đang phát trước khi thay đổi thêm cài đặt.']},
    ], source: {title: 'Spotify: Chất lượng âm thanh', url: 'https://support.spotify.com/vn-vi/article/audio-quality/'},
  },
  {
    slug: 'cach-huy-gia-han-spotify-premium', category: 'Tài khoản',
    title: 'Cách hủy gia hạn Spotify Premium và kiểm tra gói',
    description: 'Hướng dẫn tìm nơi quản lý gói Spotify Premium, kiểm tra ngày thanh toán và xử lý khi không thấy tùy chọn hủy đăng ký.',
    sections: [
      {id: 'kiem-tra', title: 'Xác định tài khoản và nơi thanh toán', paragraphs: ['Trước khi hủy, mở trang tài khoản Spotify để kiểm tra gói hiện tại và đơn vị thu tiền. Gói qua đối tác có thể phải hủy tại đối tác đó.', 'Nếu bạn dùng nhiều cách đăng nhập, nên đối chiếu email tài khoản với biên nhận. Việc đăng nhập được không đồng nghĩa bạn đang mở đúng tài khoản có thuê bao cần hủy.']},
      {id: 'huy-goi', title: 'Các bước hủy đăng ký', paragraphs: ['Đọc thông tin xác nhận cuối cùng, đặc biệt là ngày chuyển gói. Điều kiện dùng thử có thể khác gói trả phí thông thường.'], steps: ['Đăng nhập trang tài khoản Spotify chính thức.', 'Mở khu vực quản lý gói.', 'Chọn hủy đăng ký nếu tùy chọn này xuất hiện.', 'Hoàn tất xác nhận và kiểm tra trạng thái gói sau đó.']},
      {id: 'sau-khi-huy', title: 'Hủy gói có mất playlist không?', paragraphs: ['Spotify cho biết playlist và nhạc đã lưu vẫn được giữ khi tài khoản chuyển về Free. Với gói trả phí thông thường, Premium thường còn hiệu lực đến kỳ thanh toán kế tiếp; dùng thử có thể kết thúc ngay khi hủy.', 'Sau thao tác, lưu xác nhận để dễ đối chiếu nếu có vấn đề. Nếu vẫn thấy khoản thu, kiểm tra ngày phát sinh và tài khoản nhận biên nhận trước khi liên hệ hỗ trợ. Không đăng công khai ảnh chứa thông tin thanh toán.']},
    ], source: {title: 'Spotify: Cách hủy gói Premium', url: 'https://support.spotify.com/vn-vi/article/cancel-premium/'},
  },
  {
    slug: 'khac-phuc-spotify-khong-phat-nhac', category: 'Khắc phục lỗi',
    title: 'Spotify không phát nhạc: Cách kiểm tra và khắc phục',
    description: 'Kiểm tra Spotify không phát nhạc theo từng bước: âm lượng, thiết bị đầu ra, kết nối, ứng dụng và phạm vi nội dung gặp lỗi.',
    sections: [
      {id: 'xac-dinh', title: 'Phân biệt không có tiếng và không phát được', paragraphs: ['Trước hết, nhìn thanh tiến trình: bài có đang chạy nhưng không nghe thấy, hay hoàn toàn không bắt đầu? Hai tình huống này nên được kiểm tra theo hướng khác nhau.', 'Nếu thanh tiến trình chạy, kiểm tra âm lượng của máy, ứng dụng và tai nghe. Nếu không chạy, thử nội dung khác để xem vấn đề chỉ nằm ở một bài hay toàn bộ ứng dụng.']},
      {id: 'thu-lan-luot', title: 'Kiểm tra từ thao tác đơn giản', paragraphs: ['Spotify gợi ý khởi động lại, cập nhật ứng dụng và kiểm tra kết nối. Có thể thử thiết bị khác để thu hẹp nguyên nhân.'], steps: ['Chọn lại thiết bị đầu ra, ngắt tai nghe hoặc loa không dùng.', 'Thử một bài khác và kiểm tra mạng.', 'Đóng rồi mở Spotify, sau đó kiểm tra cập nhật.', 'Khởi động lại thiết bị nếu lỗi vẫn còn.', 'Chỉ cân nhắc cài lại khi các bước trước không hiệu quả.']},
      {id: 'ho-tro', title: 'Chuẩn bị thông tin khi cần hỗ trợ', paragraphs: ['Ghi lại mẫu máy, hệ điều hành, phiên bản Spotify và thời điểm lỗi xuất hiện. Một mô tả như “chỉ lỗi khi chuyển sang loa Bluetooth” dễ kiểm tra hơn “Spotify bị hỏng”.', 'Cài lại ứng dụng có thể khiến bạn phải tải lại nội dung offline. Nếu đang chuẩn bị đi xa, nên dành thời gian thử phát và tải lại playlist trước chuyến đi. Khi gửi ảnh lỗi, che email và các thông tin tài khoản không cần thiết.']},
    ], source: {title: 'Spotify: Spotify không phát', url: 'https://support.spotify.com/vn-vi/article/spotify-not-playing/'},
  },
  {
    slug: 'cach-tao-playlist-spotify', category: 'Mẹo sử dụng',
    title: 'Cách tạo playlist Spotify và sắp xếp nhạc dễ tìm',
    description: 'Hướng dẫn tạo playlist Spotify, thêm bài hát và tổ chức danh sách theo hoạt động để thư viện nhạc dễ dùng hơn mỗi ngày.',
    sections: [
      {id: 'dat-ten', title: 'Bắt đầu bằng mục đích nghe', paragraphs: ['Thay vì đặt tên “Nhạc hay 1”, hãy chọn một mục đích rõ như “Đi bộ buổi sáng” hoặc “Tập trung buổi tối”. Bạn sẽ dễ quyết định nên thêm bài nào và mở lại danh sách vào lúc nào.', 'Playlist không cần thật dài ngay từ đầu. Một nhóm bài hợp nhau thường hữu ích hơn danh sách gom mọi bài yêu thích nhưng liên tục phải bỏ qua.']},
      {id: 'tao-danh-sach', title: 'Tạo danh sách và thêm bài', paragraphs: ['Spotify hỗ trợ tạo và chỉnh sửa playlist. Vị trí nút có thể thay đổi theo thiết bị và phiên bản.'], steps: ['Mở khu vực tạo nội dung hoặc Thư viện trong Spotify.', 'Chọn tạo playlist và nhập tên dễ nhớ.', 'Tìm bài hát, mở menu của bài và thêm vào playlist.', 'Mở lại danh sách để kiểm tra những bài vừa thêm.']},
      {id: 'sap-xep', title: 'Giữ playlist gọn và dễ sử dụng', paragraphs: ['Nghe thử một lượt theo đúng bối cảnh dự định: làm việc, vận động hoặc thư giãn. Xóa các bài thường khiến bạn phải chuyển ngay. Nếu hai nhóm nhạc có nhịp độ quá khác nhau, tách thành hai danh sách.', 'Trước khi chia sẻ, kiểm tra tên, mô tả và chế độ hiển thị mà bạn muốn sử dụng. Nếu nghe trên nhiều thiết bị, đặt tên nhất quán sẽ giúp tìm nhanh hơn. Bạn có thể bắt đầu với ba danh sách theo hoạt động thay vì tạo quá nhiều mục khó duy trì.']},
    ], source: {title: 'Spotify: Tạo và chỉnh sửa danh sách phát', url: 'https://support.spotify.com/vn-vi/article/create-playlists/'},
  },
  {
    slug: 'spotify-connect-la-gi', category: 'Hướng dẫn',
    title: 'Spotify Connect là gì? Cách chuyển nhạc sang loa',
    description: 'Tìm hiểu Spotify Connect, cách chọn thiết bị phát và những điểm cần kiểm tra khi điện thoại không tìm thấy loa hoặc máy tính.',
    sections: [
      {id: 'khai-niem', title: 'Điều khiển nhạc từ một thiết bị khác', paragraphs: ['Spotify Connect cho phép dùng một thiết bị để điều khiển nhạc phát trên thiết bị tương thích khác. Điện thoại có thể đóng vai trò điều khiển trong khi âm thanh phát từ loa hoặc máy tính.', 'Trước khi bắt đầu, xác định rõ bạn muốn nghe ở đâu. Nếu một chiếc loa trong nhà đang phát mà điện thoại không có tiếng, có thể thiết bị đầu ra đang được chọn là loa đó.']},
      {id: 'ket-noi', title: 'Chọn loa hoặc máy tính để phát nhạc', paragraphs: ['Khi kết nối lần đầu, Spotify hướng dẫn đặt thiết bị trên cùng mạng Wi-Fi. Thiết bị cần được bật và hỗ trợ tính năng này.'], steps: ['Mở Spotify và bắt đầu một bài hát.', 'Mở nút chọn thiết bị trong trình phát.', 'Chọn loa hoặc máy tính mong muốn từ danh sách.', 'Kiểm tra âm lượng trên cả trình điều khiển và thiết bị phát.']},
      {id: 'khong-tim-thay', title: 'Không thấy thiết bị trong danh sách?', paragraphs: ['Kiểm tra thiết bị còn hoạt động, kết nối mạng và cập nhật phần mềm. Thử mở Spotify trên thiết bị đích rồi chọn lại từ điện thoại.', 'Để kiểm tra có hệ thống, thay đổi từng yếu tố: mạng, thiết bị đích, rồi thiết bị điều khiển. Đừng thay đổi tất cả cùng lúc vì sẽ khó biết thao tác nào có tác dụng. Khi nghe xong ở nơi dùng chung, chọn lại thiết bị cá nhân để tránh vô tình điều khiển nhạc tại chỗ khác.']},
    ], source: {title: 'Spotify: Spotify Connect', url: 'https://support.spotify.com/vn-vi/article/spotify-connect/'},
  },
]

export const existingArticles = [
  {href:'/spotify-premium-la-gi', title:'Spotify Premium là gì? Quyền lợi và cách đăng ký', description:'Tổng quan về Premium và những điều cần biết trước khi lựa chọn.', category:'Kiến thức'},
  {href:'/so-sanh-spotify-free-premium', title:'So sánh Spotify Free và Premium', description:'Đối chiếu tính năng để chọn cách nghe phù hợp.', category:'Kiến thức'},
  {href:'/spotify-premium-sinh-vien', title:'Spotify Premium dành cho sinh viên', description:'Điều kiện xác minh và hướng dẫn đăng ký Student.', category:'Tài khoản'},
]
export const articleLinks = [...existingArticles, ...articles.map(a=>({...a, href:'/bai-viet/'+a.slug}))]
