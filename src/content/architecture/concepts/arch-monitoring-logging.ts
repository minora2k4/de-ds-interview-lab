import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-monitoring-logging',
  summary:
    'Monitoring theo dõi các chỉ số đã định trước và cảnh báo khi vượt ngưỡng, còn Logging ghi chi tiết từng sự kiện để điều tra. Pipeline cần đo cả hệ thống lẫn chính dữ liệu.',
  tags: ['Vận hành', 'Monitoring', 'Logging'],
  related: ['arch-observability', 'arch-reliability', 'arch-pipeline-design', 'etl-orchestration', 'etl-data-quality', 'kafka-consumer-group'],
  sections: {
    definition: `**Monitoring (Giám sát)** là việc thu thập chỉ số theo thời gian và cảnh báo khi vượt ngưỡng đã định. **Logging (Ghi log)** là việc ghi lại từng sự kiện kèm ngữ cảnh. Metric cho biết **có chuyện xảy ra**, còn log giúp hiểu **chuyện gì đã xảy ra**.`,

    origin: `Pipeline thời đầu chỉ dựa vào email báo job lỗi. Cách này bỏ sót lỗi nguy hiểm nhất: job vẫn thành công nhưng ghi 0 dòng hoặc chạy trễ.`,

    whyUse: `Phát hiện sớm giúp có thời gian sửa trước hạn báo cáo. Log có cấu trúc giúp tìm nguyên nhân nhanh hơn.`,

    mechanism: `**Nên đo gì, theo ba tầng:**

- **Hạ tầng:** Google SRE nêu bốn tín hiệu vàng là latency, traffic, errors, saturation. Với stream, thêm [[kafka-consumer-group|consumer lag]].
- **Job:** trạng thái, thời lượng so với thường lệ, số lần retry.
- **Dữ liệu:** độ tươi, số dòng đọc và ghi, tỷ lệ bản ghi lỗi. Tầng này hay bị bỏ qua nhất.

**Log có cấu trúc:** dùng JSON với \`run_id\`, tên bộ dữ liệu, partition, số dòng, để lọc được theo lần chạy. Không ghi dữ liệu cá nhân vào log.

**Cảnh báo phải hành động được:** cảnh báo theo triệu chứng người dùng thấy, như bảng trễ quá hạn, và có người nhận cùng hướng dẫn xử lý. Quá nhiều cảnh báo vô ích khiến mọi người bỏ qua cả cảnh báo thật.`,

    example: `Một pipeline thường chạy 40 phút. Hôm nay nó thành công sau 4 phút, và ghi 12.000 dòng thay vì 3 triệu. Cảnh báo theo trạng thái job không kêu. Cảnh báo số dòng báo ngay, và log theo \`run_id\` cho thấy nguồn chưa ghi xong tệp.`,

    prosCons: {
      pros: ['Metric rẻ, phù hợp để xem xu hướng và cảnh báo.', 'Log đủ chi tiết để điều tra một lần chạy cụ thể.'],
      cons: ['Log lớn thì tốn kém, cần phân tầng thời gian lưu.', 'Ngưỡng cố định dễ sai với dữ liệu có chu kỳ.'],
    },

    whenToUse: {
      use: ['Mọi pipeline có người dùng cần ít nhất cảnh báo về độ tươi và số dòng.'],
      avoid: ['Không gọi người trực vì lỗi đã tự phục hồi sau retry.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Metric', 'Log'],
      rows: [
        ['Trả lời', 'Có vấn đề không?', 'Chi tiết là gì?'],
        ['Dạng dữ liệu', 'Số theo thời gian', 'Sự kiện có ngữ cảnh'],
        ['Chi phí lưu', 'Thấp', 'Cao'],
      ],
    },

    misconceptions: [
      {
        myth: 'Job xanh nghĩa là dữ liệu ổn.',
        truth: 'Job xanh chỉ cho biết code chạy xong. Dữ liệu vẫn có thể thiếu hoặc sai, nên cần đo trực tiếp dữ liệu.',
      },
    ],
  },
})
