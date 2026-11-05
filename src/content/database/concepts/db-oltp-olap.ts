import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-oltp-olap',
  summary:
    'OLTP phục vụ nhiều giao dịch nhỏ trên vài dòng, OLAP phục vụ ít truy vấn lớn quét nhiều dòng nhưng chỉ vài cột. Hai kiểu truy cập đối lập nên cần cách lưu trữ và lược đồ khác nhau.',
  tags: ['Hệ thống', 'Lưu trữ cột', 'Kho dữ liệu', 'First Principles'],
  related: ['db-normalization', 'db-denormalization', 'dw-data-warehouse', 'dw-star-schema', 'etl-cdc', 'cloud-bigquery'],
  sections: {
    definition: `**OLTP (Online Transaction Processing, xử lý giao dịch trực tuyến)** phục vụ các thao tác ngắn của nghiệp vụ: đặt hàng, chuyển tiền, cập nhật hồ sơ. Mỗi thao tác chạm vài dòng, và cần phản hồi trong vài mili giây.

**OLAP (Online Analytical Processing, xử lý phân tích trực tuyến)** phục vụ câu hỏi phân tích trên khối lượng lớn: doanh thu theo tháng, theo vùng. Mỗi truy vấn quét hàng triệu đến hàng tỷ dòng, nhưng thường chỉ cần vài cột.`,

    origin: `Những năm 1980, doanh nghiệp chạy báo cáo ngay trên cơ sở dữ liệu nghiệp vụ. Báo cáo quét bảng làm chậm giao dịch, còn lược đồ [[db-normalization|3NF]] buộc phải Join nhiều bảng. [[dw-data-warehouse]] ra đời để tách hai loại tải, và Codd đặt tên OLAP năm 1993.

Tuy nhiên, kho dữ liệu thời đó vẫn lưu theo dòng, nên quét vẫn tốn. Các hệ lưu theo cột như C-Store, sau đó là BigQuery, Redshift, khắc phục tiếp điểm yếu này.`,

    whyUse: `Hiểu sự khác biệt giúp chọn đúng hệ thống. Chạy báo cáo tỷ dòng trên PostgreSQL thì chậm và làm hại giao dịch. Dùng kho dữ liệu để phục vụ tra cứu từng đơn hàng thì tốn kém và độ trễ cao. Tách hai tải còn bảo vệ hệ nghiệp vụ khỏi các truy vấn phân tích bất ngờ.`,

    mechanism: `**Vì sao lưu trữ khác nhau:** chi phí chủ yếu nằm ở số trang phải đọc.

- **OLTP lưu theo dòng:** các cột của một dòng nằm cạnh nhau. Lấy hoặc sửa một dòng chỉ đụng vài trang, qua index B-tree.
- **OLAP lưu theo cột:** các giá trị của cùng một cột nằm cạnh nhau. \`SUM(amount)\` chỉ đọc đúng cột cần.

**Vì sao lưu cột nhanh hơn nhiều cho phân tích:**

- **Bỏ qua cột thừa:** không phải đọc 97 cột không dùng.
- **Nén tốt:** cùng kiểu dữ liệu và hay lặp, nên run-length hay dictionary encoding rất hiệu quả.
- **Thực thi theo lô:** xử lý từng khối giá trị, tận dụng tốt CPU hơn xử lý từng dòng.
- **Bỏ khối nhờ metadata:** lưu min, max mỗi khối để bỏ qua các khối không thể khớp \`WHERE\`.

**Vì sao lưu cột khó ghi:** sửa một dòng phải chạm nhiều vùng cột đã nén. Vì vậy, hệ OLAP thường nạp theo lô và gom thay đổi lại trước khi ghi.

**Vì sao không chạy phân tích trên OLTP:**

- Quét lớn đẩy các trang nóng ra khỏi buffer cache, làm giao dịch khác phải đọc đĩa.
- Snapshot chạy hàng giờ cản \`VACUUM\` và làm bảng phình ra.
- Truy vấn lớn tranh CPU và I/O với giao dịch.

Dữ liệu được đưa sang OLAP qua ETL hoặc [[etl-cdc]], đổi lại có độ trễ. Lược đồ cũng khác: OLTP dùng 3NF để ghi an toàn, OLAP dùng [[dw-star-schema]] để Join ít.`,

    example: `Bảng \`orders\` có 1 tỷ dòng, 100 cột, trung bình 8 byte mỗi cột, tổng 800 GB. Báo cáo doanh thu theo tháng cần 3 cột.

- **Lưu theo dòng:** phải đọc gần hết 800 GB. Ở tốc độ 500 MB/s mất khoảng 27 phút, và còn đẩy cache của hệ nghiệp vụ.
- **Lưu theo cột:** chỉ đọc 24 GB, nén 5 lần còn khoảng 5 GB, tức khoảng 10 giây.

Ngược lại, lấy một đơn hàng theo \`order_id\` chỉ tốn vài lần đọc trang trên hệ lưu theo dòng. Trên hệ lưu theo cột, muốn lấy đủ 100 cột phải mở khối nén của từng cột, nên chậm và tốn hơn nhiều.`,

    prosCons: {
      pros: [
        '**OLTP:** độ trễ thấp, giao dịch an toàn, chịu được nhiều người ghi đồng thời.',
        '**OLAP:** truy vấn lớn nhanh, nén tốt nên rẻ hơn, người phân tích tự do khám phá dữ liệu.',
        '**Tách hai hệ:** báo cáo không còn làm hại giao dịch.',
      ],
      cons: [
        '**OLTP:** quét lớn chậm và ảnh hưởng đến nghiệp vụ.',
        '**OLAP:** dữ liệu có độ trễ, ghi và cập nhật từng dòng đắt, không hợp với tải đồng thời cao.',
        '**Tách hai hệ:** tốn công vận hành pipeline, và có thêm rủi ro lệch dữ liệu.',
      ],
    },

    whenToUse: {
      use: [
        '**OLTP:** thao tác nghiệp vụ, tra cứu theo khóa, cần giao dịch và ràng buộc.',
        '**OLAP:** báo cáo, tổng hợp lịch sử, truy vấn đổi liên tục trên dữ liệu lớn.',
        '**Read replica:** báo cáo nhỏ cần dữ liệu khá mới, khi chưa đủ lớn để cần kho dữ liệu.',
      ],
      avoid: [
        'Không chạy truy vấn phân tích hàng giờ trên primary của hệ nghiệp vụ.',
        'Không phục vụ API tra cứu từng dòng với tải đồng thời cao từ kho dữ liệu.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'OLTP', 'OLAP'],
      rows: [
        ['Truy vấn điển hình', 'Đọc, ghi vài dòng theo khóa', 'Quét và gom nhóm nhiều dòng'],
        ['Người dùng', 'Ứng dụng, hàng nghìn phiên', 'Người phân tích, dashboard'],
        ['Độ trễ mục tiêu', 'Mili giây', 'Giây đến phút'],
        ['Lưu trữ', 'Theo dòng, B-tree', 'Theo cột, nén'],
        ['Lược đồ', '[[db-normalization|3NF]]', '[[dw-star-schema|Star Schema]], bảng rộng'],
        ['Cách ghi', 'Liên tục từng dòng', 'Nạp theo lô'],
        ['Ví dụ', 'PostgreSQL, MySQL', 'BigQuery, Redshift, ClickHouse'],
      ],
    },

    misconceptions: [
      {
        myth: 'OLAP chỉ là OLTP chạy trên máy mạnh hơn.',
        truth: 'Khác biệt nằm ở bố cục lưu trữ và mô hình thực thi. Thêm phần cứng không làm hệ lưu theo dòng ngừng đọc các cột thừa.',
      },
      {
        myth: 'Có read replica là đã có giải pháp OLAP.',
        truth: 'Replica bảo vệ primary khỏi tải đọc, nhưng vẫn lưu theo dòng, và truy vấn dài có thể xung đột với việc phát lại log.',
      },
      {
        myth: 'Không có B-tree nên kho dữ liệu cột luôn phải quét toàn bộ.',
        truth: 'Các hệ này bỏ qua khối bằng min, max, sắp xếp, cắt partition và chỉ đọc cột cần, nên thường đọc rất ít so với kích thước bảng.',
      },
    ],
  },
})
