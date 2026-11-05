import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-batch',
  summary:
    'Batch Architecture xử lý dữ liệu theo từng lô có giới hạn, chạy theo lịch hoặc theo tín hiệu. Đơn giản, rẻ và dễ chạy lại, nhưng độ tươi bị giới hạn bởi chu kỳ chạy.',
  tags: ['Kiến trúc', 'Batch'],
  related: ['etl-batch', 'etl-orchestration', 'etl-incremental', 'etl-idempotency', 'arch-streaming', 'arch-lambda', 'arch-pipeline-design'],
  sections: {
    definition: `**Batch Architecture (Kiến trúc xử lý theo lô)** tổ chức hệ thống dữ liệu quanh các lần chạy trên **dữ liệu có giới hạn**, thường theo partition thời gian. Trang [[etl-batch]] nói về kỹ thuật xử lý, còn trang này nói về cách ghép các thành phần.`,

    origin: `Đây là cách làm lâu đời nhất, từ ETL chạy đêm đến [[hadoop-mapreduce|MapReduce]] và [[spark-overview|Spark]]. Điểm yếu ban đầu là các job nối nhau theo giờ cố định, nên [[etl-orchestration|orchestrator]] ra đời để chạy theo phụ thuộc.`,

    whyUse: `Dữ liệu đầu vào không đổi trong lúc chạy, nên kết quả dễ tái lập và dễ kiểm tra. Máy chỉ bật khi có việc nên chi phí thấp hơn hệ thống chạy liên tục.`,

    mechanism: `1. **Thu thập:** đưa dữ liệu vào vùng thô, chia theo ngày hoặc giờ.
2. **Chờ đủ dữ liệu:** dùng tín hiệu hoàn tất thay vì đoán theo giờ, để không đọc dữ liệu thiếu.
3. **Biến đổi theo partition:** job nhận tham số ngày chạy thay vì đọc giờ hệ thống, nhờ vậy chạy lại ngày cũ vẫn đúng.
4. **Ghi đè nguyên tử:** thay partition sau khi kiểm tra, để chạy lại không trùng.`,

    example: `Một chuỗi 200 cửa hàng cần báo cáo trước 8 giờ sáng. Dữ liệu 5 GB mỗi đêm được xử lý trong 25 phút trên cụm chỉ bật lúc 2 giờ sáng. Khi phát hiện sai công thức, đội dữ liệu chạy lại 90 partition trong một buổi chiều.`,

    prosCons: {
      pros: ['Đơn giản, dễ kiểm thử và dễ chạy lại theo partition.', 'Xử lý lượng lớn trong một lần rồi tắt máy, nên rẻ.'],
      cons: ['Độ tươi không thể tốt hơn chu kỳ chạy.', 'Job lớn có thể vượt cửa sổ thời gian khi dữ liệu tăng.'],
    },

    whenToUse: {
      use: ['Người dùng ra quyết định theo ngày hoặc theo giờ.', 'Logic cần toàn bộ dữ liệu của một kỳ, như chốt sổ hay đối soát.'],
      avoid: ['Quyết định phải có trong vài giây, như chặn gian lận: dùng [[arch-streaming]].'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Batch', 'Streaming'],
      rows: [
        ['Dữ liệu vào', 'Có giới hạn', 'Không có điểm kết thúc'],
        ['Độ trễ', 'Phút đến giờ', 'Mili giây đến phút'],
        ['Chạy lại', 'Ghi đè partition', 'Phát lại log'],
        ['Vận hành', 'Theo lịch, tắt máy được', 'Chạy liên tục, giữ state'],
      ],
    },

    misconceptions: [
      {
        myth: 'Batch là cách làm cũ, đã bị streaming thay thế.',
        truth: 'Phần lớn báo cáo và chốt số vẫn hợp với batch, vì độ tươi cao hơn không đổi được quyết định, mà chỉ làm tăng chi phí.',
      },
    ],
  },
})
