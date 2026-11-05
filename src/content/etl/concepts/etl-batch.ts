import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-batch',
  summary:
    'Batch Processing xử lý một tập dữ liệu có giới hạn theo lịch hoặc theo sự kiện kích hoạt, đánh đổi độ trễ để lấy thông lượng cao, chi phí thấp và khả năng chạy lại dễ dàng.',
  tags: ['Batch', 'Mô hình xử lý'],
  related: ['etl-stream', 'etl-orchestration', 'etl-idempotency', 'arch-batch', 'hadoop-mapreduce', 'spark-overview'],
  sections: {
    definition: `**Batch Processing (Xử lý theo lô)** là xử lý một **tập dữ liệu có giới hạn**, biết rõ điểm đầu và điểm cuối, ví dụ đơn hàng của ngày hôm qua. Job chạy xong thì kết thúc.`,

    origin: `Batch có từ thời máy tính lớn, khi tính toán được xếp vào ban đêm để không ảnh hưởng hệ thống nghiệp vụ. [[hadoop-mapreduce|MapReduce]] rồi [[spark-overview|Spark]] mở rộng cách này lên nhiều máy.`,

    whyUse: `Đầu vào có giới hạn nên kết quả **đầy đủ** và kiểm tra được trước khi công bố.`,

    mechanism: `1. **Kích hoạt** theo lịch hoặc khi nguồn sẵn sàng, thường do [[etl-orchestration|hệ thống điều phối]] thực hiện.
2. **Xác định phạm vi** cố định, ví dụ partition ngày 01/11. Nhờ vậy chạy lại vẫn đọc đúng dữ liệu đó.
3. **Xử lý** song song.
4. **Công bố:** ghi vào vị trí tạm, kiểm tra, rồi thay partition đích một cách nguyên tử.

Đầu vào cố định làm batch rất hợp với [[etl-idempotency|idempotency]]: chạy lại một ngày chỉ ghi đè partition của ngày đó.`,

    example: `Một ngân hàng đối soát 30 triệu giao dịch mỗi đêm, chạy 40 phút sau khi khóa sổ. Nếu sai tỷ giá, đội dữ liệu chỉ cần sửa rồi chạy lại partition đó.`,

    prosCons: {
      pros: ['Thông lượng cao, chi phí trên mỗi dòng thấp.', 'Dễ kiểm thử, dễ chạy lại và dễ bảo đảm đầy đủ.'],
      cons: ['Độ trễ ít nhất bằng chu kỳ chạy cộng thời gian chạy.', 'Dữ liệu đến sau khi chốt lô cần cơ chế xử lý lại.'],
    },

    whenToUse: {
      use: ['Báo cáo định kỳ, đối soát tài chính, tổng hợp lịch sử.', 'Khi kết quả cần đầy đủ hơn là có ngay.'],
      avoid: [
        'Khi quyết định phải có trong vài giây, như phát hiện gian lận lúc thanh toán.',
        'Khi chạy vài phút một lần mà chi phí khởi động lớn. Khi đó nên xem xét [[etl-stream|Stream Processing]].',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Batch', 'Stream'],
      rows: [
        ['Đầu vào', 'Có giới hạn', 'Không giới hạn'],
        ['Độ trễ', 'Phút đến giờ', 'Mili giây đến giây'],
        ['Tính đầy đủ', 'Rõ ràng trong phạm vi lô', 'Ước lượng bằng watermark'],
      ],
    },

    misconceptions: [
      {
        myth: 'Batch đã lỗi thời và stream sẽ thay thế hoàn toàn.',
        truth: 'Nhiều bài toán không cần độ trễ thấp, nên chi phí và độ phức tạp của stream là không đáng.',
      },
      {
        myth: 'Batch đồng nghĩa với chạy mỗi ngày một lần.',
        truth: 'Job 5 phút một lần vẫn là batch nếu mỗi lần xử lý một tập có giới hạn rồi kết thúc.',
      },
    ],
  },
})
