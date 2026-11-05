import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-incremental',
  summary:
    'Kiểm tra tăng dần chỉ tính chỉ số cho Partition mới, lưu lại, rồi so với lịch sử để phát hiện bất thường, không quét lại dữ liệu cũ. Giả định chính là dữ liệu chỉ thêm vào, nên dữ liệu đến trễ và cập nhật cần được xử lý riêng.',
  tags: ['Partition', 'Tăng dần', 'Bất thường'],
  related: ['dq-scale-strategy', 'dq-approximate', 'dq-metrics', 'dq-tools', 'etl-incremental', 'db-partitioning'],
  sections: {
    definition: `**Incremental Validation (Kiểm tra tăng dần)** là kiểm tra chất lượng chỉ trên phần dữ liệu mới, và giữ kết quả từng Partition để so sánh theo thời gian. Chi phí tỷ lệ với lượng dữ liệu mới, không tỷ lệ với kích thước bảng.`,

    origin: `Kiểm tra cả bảng hằng ngày nghĩa là phải đọc đi đọc lại các dữ liệu đã kiểm tra, với chi phí tăng dần theo thời gian. Khi bảng lớn lên, kiểm tra sẽ vượt quá ngân sách. Deequ của Amazon đưa cách làm tăng dần vào hệ thống kiểm tra, bằng cách lưu một trạng thái cho mỗi lần tính và chỉ cập nhật trạng thái từ phần dữ liệu mới.`,

    whyUse: `Lỗi thường đến cùng dữ liệu mới, nên kiểm tra phần mới là đúng trọng tâm. Chỉ số trên cả bảng còn **pha loãng lỗi**: một ngày mất nửa dữ liệu chỉ làm thay đổi rất nhỏ trên tổng 3 năm, nhưng rất rõ khi xem theo Partition.`,

    mechanism: `1. **Tính chỉ số cho Partition mới:** số dòng, tỷ lệ null, phân vị, sketch.
2. **Lưu lại** vào kho chỉ số, kèm phiên bản dữ liệu và thời gian tính.
3. **So với lịch sử:** cùng thứ của các tuần trước, để phát hiện bất thường theo mùa vụ. Xem [[dq-metrics]].
4. **Quyết định:** cho công bố, cách ly, hoặc cảnh báo. Có thể ghi vào vùng tạm, kiểm tra xong mới công bố, còn gọi là **Write-Audit-Publish**.

**Gộp chỉ số cho cả bảng:** số dòng và số null thì cộng được. Tỷ lệ null phải cộng tử số và mẫu số, không lấy trung bình các tỷ lệ. Số giá trị khác nhau không cộng được, nên phải lưu [[dq-approximate|HyperLogLog]] và gộp sketch.

**Giới hạn:**
- **Dữ liệu đến trễ:** Partition cũ được thêm dữ liệu, chỉ số đã lưu lỗi thời. Phải tính lại các Partition bị ảnh hưởng, và chỉ so sau cửa sổ ổn định.
- **Cập nhật và xóa:** tính tăng dần dựa trên giả định chỉ thêm. Sửa dòng cũ làm chỉ số đã lưu sai, nên cần bộ phát hiện thay đổi hoặc tính lại định kỳ.
- **Luật xuyên Partition:** khóa trùng giữa hai ngày không thấy được khi xem từng ngày. Cần so khóa mới với khóa cũ, hoặc quét định kỳ.`,

    diagram: {
      mermaid: `flowchart TD
  A["Partition mới được ghi vào vùng tạm"] --> B["Tính chỉ số và sketch"]
  B --> C["So với lịch sử cùng chu kỳ"]
  C --> D["Bình thường: công bố và lưu chỉ số"]
  C --> E["Bất thường: cách ly và cảnh báo"]
  D --> F["Kho chỉ số dùng cho lần sau"]`,
      caption: 'Chỉ đọc dữ liệu mới, còn lịch sử nằm trong kho chỉ số nên không phải quét lại.',
    },

    example: `Bảng 10 TB có 1.000 Partition ngày. Kiểm tra cả bảng tốn khoảng 10 TB mỗi ngày, còn kiểm tra tăng dần chỉ đọc 10 GB. Hôm 12/6, số dòng thấp hơn 48% so với 4 thứ Tư trước đó, nên Partition bị giữ lại và cảnh báo. Xem trên cả bảng, thay đổi này chỉ khoảng 0,05%, và sẽ không có ai nhận ra.`,

    prosCons: {
      pros: ['Chi phí không tăng theo tuổi của bảng.', 'Phát hiện lỗi từng ngày mà chỉ số toàn bảng che mất.'],
      cons: ['Phải duy trì kho chỉ số và xử lý dữ liệu đến trễ.', 'Không thấy lỗi xuyên Partition hoặc xấu đi rất chậm.'],
    },

    whenToUse: {
      use: ['Bảng chia Partition theo thời gian, chủ yếu thêm mới.', 'Cần kiểm tra ngay trước khi công bố dữ liệu.'],
      avoid: ['Không dùng một mình khi bảng được cập nhật nhiều.', 'Không lấy trung bình các tỷ lệ của từng Partition để ra tỷ lệ của cả bảng.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Kiểm tra tăng dần', 'Quét toàn bộ'],
      rows: [
        ['Chi phí mỗi lần chạy', 'Theo dữ liệu mới', 'Theo cả bảng'],
        ['Lỗi trong ngày', 'Thấy rõ', 'Bị pha loãng'],
        ['Khóa trùng giữa các ngày', 'Không thấy nếu không làm thêm', 'Thấy'],
        ['Dữ liệu cũ bị sửa', 'Có thể bỏ sót', 'Thấy'],
      ],
    },

    misconceptions: [
      { myth: 'Kiểm tra tăng dần thay thế hoàn toàn quét toàn bộ.', truth: 'Các luật xuyên Partition và dữ liệu cũ bị sửa vẫn cần một lần quét định kỳ.' },
      { myth: 'Có thể cộng số giá trị khác nhau của từng ngày.', truth: 'Một người dùng xuất hiện nhiều ngày sẽ bị đếm nhiều lần. Phải gộp sketch như HyperLogLog.' },
    ],
  },
})
