import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-scale-strategy',
  summary:
    'Khi dữ liệu lớn, đánh giá theo 5 tầng từ rẻ đến đắt: metadata, chỉ số theo Partition, thuật toán xấp xỉ, lấy mẫu phân tầng và quét toàn bộ. Mỗi luật dùng tầng rẻ nhất trả lời được nó, và quét toàn bộ chỉ dành cho luật quan trọng.',
  tags: ['Quy mô lớn', 'Chi phí', 'Parquet', 'First Principles'],
  related: ['dq-approximate', 'dq-sampling', 'dq-incremental', 'dq-tools', 'dq-metrics', 'arch-observability', 'spark-partition', 'cloud-s3'],
  sections: {
    definition: `**Data Quality at Scale (Chất lượng dữ liệu ở quy mô lớn)** là cách đánh giá khi không thể quét toàn bộ dữ liệu cho mọi luật. Ý tưởng chính là **mỗi luật chỉ dùng tầng rẻ nhất đủ để trả lời nó**.

Năm tầng từ rẻ đến đắt là metadata, chỉ số theo Partition, thuật toán xấp xỉ, lấy mẫu phân tầng và quét toàn bộ.`,

    origin: `Cách đơn giản là chạy mọi luật bằng một câu truy vấn trên cả bảng. Với bảng 10 TB, chạy hằng ngày cho vài trăm luật thì chi phí kiểm tra có thể gần bằng chi phí của chính pipeline, và kết quả về chậm đến mức mất tác dụng.

Thực tế thì hầu hết câu hỏi không cần đọc mọi dòng. Định dạng cột như Parquet đã lưu sẵn thống kê, dữ liệu mới chỉ nằm trong Partition mới, và các thuật toán sketch cho kết quả xấp xỉ bằng bộ nhớ rất nhỏ. Chiến lược nhiều tầng tận dụng các điều đó.`,

    whyUse: `- **Giảm chi phí nhiều bậc:** đọc metadata tốn gần như không đáng kể so với quét dữ liệu.
- **Phát hiện sớm hơn:** kiểm tra rẻ chạy được mỗi giờ, ngay sau khi dữ liệu về.
- **Bao phủ rộng:** kiểm tra được hàng nghìn bảng, thay vì vài bảng quan trọng.`,

    mechanism: `**Tầng 1: Metadata.** Không đọc dữ liệu. Footer của Parquet nằm ở cuối tệp, luôn có số dòng, và thường có min, max, số null theo từng row group. Kèm thêm dung lượng và thời gian ghi để biết độ tươi. Phát hiện được: bảng không có dữ liệu mới, số dòng tụt mạnh, giá trị ngoài khoảng. **Chú ý:** thống kê theo cột là tùy chọn. Thiếu \`null_count\` không có nghĩa là 0, và min, max có thể chỉ là cận được rút gọn, không phải giá trị thật.

**Tầng 2: [[dq-incremental|Chỉ số theo Partition]].** Tính chỉ số cho Partition mới một lần, lưu lại, rồi so với lịch sử. Không quét lại dữ liệu cũ. Chi phí tỷ lệ với lượng dữ liệu mới, không phải tổng kích thước bảng. Phát hiện được: tỷ lệ null tăng, phân phối thay đổi trong ngày hôm nay.

**Tầng 3: [[dq-approximate|Thuật toán xấp xỉ]].** HyperLogLog đếm số giá trị khác nhau, Count-Min Sketch ước lượng tần suất, t-digest ước lượng phân vị. Bộ nhớ nhỏ, sai số biết trước hoặc đo được, và thường gộp được giữa các Partition. Phát hiện được: cardinality tăng đột biến, key lệch, p99 thay đổi.

**Tầng 4: [[dq-sampling|Lấy mẫu phân tầng]].** Rẻ, và cho phép kiểm tra phức tạp như đối chiếu với nguồn gốc. **Nhưng dễ bỏ sót lỗi hiếm:** lỗi 1 trên 1 triệu dòng khó xuất hiện trong mẫu nhỏ.

**Tầng 5: Quét toàn bộ.** Chính xác nhưng đắt, chỉ dành cho luật không thể sai và không tầng nào thay thế được, như tính duy nhất của khóa chính ở bảng cốt lõi, chạy theo lịch thưa hơn.

**Vì sao không bỏ qua được tầng 5?** Có những câu hỏi về toàn cục mà tầng rẻ không trả lời được. HyperLogLog sai số 1% trên 100 tỷ dòng tương đương sai lệch 1 tỷ, nên không thể chứng minh khóa không trùng. Lấy mẫu 1% chỉ giữ được 0,01% số cặp trùng, vì phải chọn trúng cả hai dòng. Trên thực tế, có thể giảm chi phí bằng cách **chỉ so khóa mới với khóa cũ** khi dữ liệu chỉ thêm vào.

**Cách phân bổ:** với mỗi luật, hãy hỏi: cần chính xác đến đâu, sai thì mất gì, có tầng rẻ hơn trả lời đủ không.`,

    diagram: {
      mermaid: `flowchart TD
  A["Tầng 1 - Metadata: số dòng, min, max, null trong footer Parquet, độ tươi"] --> B["Tầng 2 - Chỉ số theo Partition: tính tăng dần, so với lịch sử"]
  B --> C["Tầng 3 - Thuật toán xấp xỉ: HyperLogLog, Count-Min Sketch, t-digest"]
  C --> D["Tầng 4 - Lấy mẫu phân tầng: rẻ nhưng dễ bỏ sót lỗi hiếm"]
  D --> E["Tầng 5 - Quét toàn bộ: chỉ cho luật quan trọng"]`,
      caption:
        'Đi từ rẻ đến đắt. Càng xuống dưới càng tốn kém, nên chạy ít luật hơn và với tần suất thấp hơn.',
    },

    example: `Bảng \`events\` 10 TB, 100 tỷ dòng, chia Partition theo ngày, mỗi ngày khoảng 10 GB:

| Luật | Tầng | Tần suất |
|---|---|---|
| Có Partition hôm nay, số dòng bình thường | 1 | Mỗi giờ |
| \`event_time\` không ở tương lai | 1 | Mỗi lần ghi |
| Tỷ lệ null, PSI của 20 cột chính | 2 | Hằng ngày, chỉ đọc 10 GB |
| Số người dùng khác nhau, top key | 3 | Hằng ngày, gộp sketch theo tháng |
| Đối chiếu 5.000 sự kiện với nguồn gốc | 4 | Hằng tuần |
| \`event_id\` không trùng toàn bảng | 5 | Hằng tháng, chỉ một cột |

Sau khi chuyển sang cách này, lượng dữ liệu đọc hằng ngày cho kiểm tra giảm từ hơn 10 TB xuống khoảng 10 GB. Kiểm tra toàn bộ giảm từ mỗi ngày xuống mỗi tháng, đồng thời kết quả về trong vài phút.`,

    prosCons: {
      pros: [
        '**Chi phí tỷ lệ với dữ liệu mới,** không tăng theo tổng kích thước bảng.',
        '**Kiểm tra rẻ cho phép chạy thường xuyên** và bao phủ nhiều bảng.',
        '**Dùng đúng mức chính xác cho từng luật,** thay vì mọi luật đều đắt.',
      ],
      cons: [
        '**Có thể bỏ sót lỗi hiếm** nằm giữa các lần quét toàn bộ.',
        '**Hệ thống phức tạp hơn:** phải lưu lịch sử, lưu sketch, và xử lý dữ liệu đến trễ.',
        '**Sai số và thống kê tùy chọn** đòi hỏi người dùng hiểu rõ kết quả có nghĩa gì.',
      ],
    },

    whenToUse: {
      use: [
        'Bảng lớn đến mức quét toàn bộ hằng ngày là quá đắt hoặc quá chậm.',
        'Có nhiều bảng cần bao phủ với ngân sách hạn chế.',
        'Dữ liệu chủ yếu là thêm mới và chia Partition theo thời gian.',
      ],
      avoid: [
        'Không dùng xấp xỉ cho luật yêu cầu đúng tuyệt đối, như đối soát tiền.',
        'Không dùng khi bảng nhỏ: quét toàn bộ vốn đã rẻ và đơn giản hơn nhiều.',
      ],
    },

    comparison: {
      intro: 'So sánh 5 tầng:',
      headers: ['Tầng', 'Đọc gì', 'Trả lời được', 'Bỏ sót'],
      rows: [
        ['Metadata', 'Footer, thông tin tệp', 'Độ tươi, số dòng, khoảng giá trị', 'Mọi lỗi bên trong khoảng'],
        ['Theo Partition', 'Partition mới', 'Bất thường so với lịch sử', 'Lỗi xuyên Partition, xấu đi từ từ'],
        ['Xấp xỉ', 'Một lượt qua dữ liệu mới, giữ sketch', 'Cardinality, top key, phân vị', 'Vi phạm nhỏ hơn sai số'],
        ['Lấy mẫu', 'Một phần nhỏ', 'Tỷ lệ lỗi, đối chiếu thủ công', 'Lỗi hiếm, trùng lặp'],
        ['Quét toàn bộ', 'Mọi dòng của cột cần xét', 'Khóa, tham chiếu toàn cục', 'Không, nhưng đắt'],
      ],
    },

    misconceptions: [
      {
        myth: 'Dữ liệu lớn thì chỉ cần lấy mẫu là đủ.',
        truth: 'Lấy mẫu là tầng thứ tư. Nhiều câu hỏi được trả lời rẻ và chính xác hơn bằng metadata, còn lỗi hiếm và trùng lặp thì lấy mẫu rất khó bắt được.',
      },
      {
        myth: 'Footer của Parquet luôn có đủ thống kê chính xác.',
        truth: 'Chỉ số dòng là bắt buộc. Thống kê theo cột là tùy chọn, min, max có thể bị rút gọn, và thiếu `null_count` không được coi là 0.',
      },
      {
        myth: 'Với định dạng cột, quét toàn bộ rất rẻ nên không cần phân tầng.',
        truth: 'Định dạng cột chỉ giảm số cột phải đọc. Vẫn phải đọc mọi dòng của cột đó, và tốn kém nhân lên với số luật và số bảng.',
      },
    ],
  },
})
