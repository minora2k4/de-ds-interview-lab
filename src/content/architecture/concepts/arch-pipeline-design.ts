import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-pipeline-design',
  summary:
    'Thiết kế Data Pipeline là đi ngược từ nhu cầu của người dùng dữ liệu về nguồn, rồi chọn cách thu thập, lưu trữ, biến đổi và phục vụ sao cho chạy lại được an toàn, phát hiện được lỗi và phục hồi được.',
  tags: ['Thiết kế', 'Pipeline', 'Idempotency', 'First Principles'],
  related: ['arch-batch', 'arch-streaming', 'etl-idempotency', 'etl-incremental', 'etl-orchestration', 'etl-validation', 'arch-reliability', 'arch-observability'],
  sections: {
    definition: `**Data Pipeline Design (Thiết kế Data Pipeline)** là việc quyết định dữ liệu đi từ nguồn đến người dùng như thế nào, gồm các bước thu thập, lưu trữ, biến đổi, phục vụ, cùng cách điều phối, giám sát và phục hồi khi có lỗi.

Pipeline tốt không phải là pipeline chạy được một lần, mà là pipeline **chạy lại được, biết khi nào sai, và sửa được khi sai**.`,

    origin: `Trước đây, nhiều hệ thống chỉ là các script chạy bằng cron, nối với nhau theo giờ giấc. Job trước chạy trễ thì job sau đọc dữ liệu cũ mà không ai biết. Lỗi giữa chừng để lại dữ liệu dở dang. Chạy lại thì dữ liệu bị trùng.

Từ đó hình thành các nguyên tắc thiết kế: tách lớp dữ liệu thô, biến đổi [[etl-idempotency|idempotent]], [[etl-orchestration|điều phối]] theo phụ thuộc thay vì theo giờ, kiểm tra chất lượng trước khi công bố.`,

    whyUse: `- **Giảm sự cố lặp lại:** phần lớn sự cố nằm ở các tình huống có thể biết trước như chạy lại, dữ liệu đến trễ, schema thay đổi.
- **Tránh xây thừa:** làm rõ yêu cầu có thể cho thấy báo cáo mỗi giờ là đủ, không cần stream 24/7.`,

    mechanism: `Các bước thiết kế theo thứ tự, và lý do của từng bước:

1. **Bắt đầu từ người dùng:** ai dùng, dùng để làm gì, cần mới đến mức nào, sai số bao nhiêu thì chấp nhận được. Độ tươi quyết định [[arch-batch|batch]] hay [[arch-streaming|stream]], nên phải hỏi trước khi chọn công cụ.
2. **Ước lượng quy mô:** số dòng, kích thước, đỉnh tải, thời gian giữ. Con số quyết định có cần xử lý phân tán không.
3. **Thống nhất dữ liệu:** grain của bảng, khóa, schema, ai chịu trách nhiệm khi nguồn đổi.
4. **Chọn cách lấy dữ liệu:** [[etl-full-load|full load]], [[etl-incremental|incremental]] hay [[etl-cdc|CDC]], tùy kích thước và việc có cần bắt được thao tác xóa không.
5. **Lưu dữ liệu thô bất biến:** để tính lại mà không phải đọc lại nguồn, vì nguồn có thể đã đổi hoặc đã xóa.
6. **Biến đổi idempotent:** chạy lại cho cùng kết quả, thường bằng cách ghi đè theo partition hoặc \`MERGE\` theo khóa. Nếu không có điều này, retry sẽ tạo dữ liệu trùng.
7. **Kiểm tra rồi mới công bố:** ghi vào vùng tạm, [[etl-validation|kiểm tra]], rồi chuyển đổi một cách nguyên tử, để người dùng không bao giờ đọc phải dữ liệu dở dang.
8. **Thiết kế đường lỗi:** bản ghi xấu vào quarantine hoặc Dead Letter Queue, có đường xử lý lại và [[arch-reliability|backfill]].
9. **Giám sát theo cam kết với người dùng:** đo độ tươi, số dòng, chất lượng, không chỉ trạng thái job. Xem [[arch-monitoring-logging]] và [[arch-observability]].`,

    diagram: {
      mermaid: `flowchart TD
  A["Nguồn: OLTP, API, sự kiện"] --> B["Thu thập: incremental hoặc CDC"]
  B --> C["Vùng thô bất biến"]
  C --> D["Biến đổi idempotent"]
  D --> E["Kiểm tra chất lượng"]
  E --> F["Công bố nguyên tử cho người dùng"]
  E --> G["Quarantine và xử lý lại"]`,
      caption:
        'Vùng thô cho phép tính lại, biến đổi idempotent cho phép chạy lại, và cổng kiểm tra chặn dữ liệu xấu trước khi đến tay người dùng.',
    },

    example: `Một sàn thương mại điện tử cần bảng doanh thu trước 7 giờ sáng. Có 10 triệu đơn mỗi ngày, mỗi dòng khoảng 1 KB, tức 10 GB thô, nén Parquet còn khoảng 2,5 GB. Giữ 3 năm thì cần khoảng 2,7 TB ở dạng nén.

Ngày chốt lúc 0 giờ, nguồn có 1 giờ để ghi nốt dữ liệu, nên pipeline có 6 giờ. Job chạy 40 phút, còn dư thời gian cho hai lần retry. Vì không ai cần số theo phút, đội chọn batch, không dùng stream. Job ghi đè theo partition ngày, nên chạy lại không trùng. Nếu số dòng thấp hơn 30% so với cùng thứ tuần trước, bảng không được công bố và người trực được báo ngay, khi còn hơn 5 giờ trước hạn.`,

    prosCons: {
      pros: [
        '**Vận hành dễ đoán:** lỗi đã được tính trước, có đường xử lý và không cần can thiệp đặc biệt.',
        '**Sửa được quá khứ:** dữ liệu thô và biến đổi idempotent biến việc sửa bug thành một lần chạy lại.',
      ],
      cons: [
        '**Tốn thêm công và lưu trữ:** vùng thô, vùng tạm và cổng kiểm tra đều có chi phí.',
        '**Có thể thiết kế quá mức:** một báo cáo nhỏ không cần đủ mọi thành phần.',
      ],
    },

    whenToUse: {
      use: [
        'Dữ liệu phục vụ quyết định kinh doanh hoặc có người dùng phụ thuộc, nên cần đủ các nguyên tắc trên.',
        'Viết rõ SLA cho từng bộ dữ liệu trước khi chọn công nghệ.',
      ],
      avoid: [
        'Không chọn stream chỉ vì người dùng nói "real-time" mà chưa hỏi rõ độ trễ thật sự cần.',
        'Không chạy nối tiếp theo giờ cố định khi có thể chạy theo phụ thuộc.',
      ],
    },

    comparison: {
      intro: 'Các quyết định chính, và khi nào nên chọn phương án phức tạp hơn:',
      headers: ['Quyết định', 'Mặc định đơn giản', 'Chuyển sang khi', 'Đánh đổi'],
      rows: [
        ['Độ tươi', 'Batch hằng ngày hoặc hằng giờ', 'Quyết định cần số trong vài phút', 'Stream tốn vận hành hơn'],
        ['Lấy dữ liệu', 'Incremental theo cột thời gian', 'Cần bắt thao tác xóa và mọi thay đổi', 'CDC cần quyền đọc log và thêm hệ thống'],
        ['Xử lý bản ghi xấu', 'Dừng pipeline', 'Tỷ lệ lỗi nhỏ và không được chặn cả luồng', 'Quarantine cần quy trình xử lý lại'],
      ],
    },

    misconceptions: [
      {
        myth: 'Thiết kế pipeline bắt đầu bằng việc chọn Kafka hay Spark.',
        truth: 'Công cụ là hệ quả của yêu cầu. Chưa biết độ tươi, quy mô và độ chính xác thì chưa có cơ sở để chọn.',
      },
      {
        myth: 'Job báo thành công nghĩa là dữ liệu đúng.',
        truth: 'Job có thể chạy thành công với 0 dòng, hoặc với dữ liệu sai. Cần kiểm tra chính dữ liệu, không chỉ trạng thái job.',
      },
      {
        myth: 'Có retry là pipeline chịu được lỗi.',
        truth: 'Retry chỉ an toàn nếu bước đó idempotent. Nếu không, mỗi lần retry có thể tạo thêm dữ liệu trùng.',
      },
      {
        myth: 'Càng gần real-time càng tốt.',
        truth: 'Độ tươi cao hơn mức cần thiết chỉ làm tăng chi phí và độ phức tạp, mà không đổi được quyết định nào của người dùng.',
      },
    ],
  },
})
