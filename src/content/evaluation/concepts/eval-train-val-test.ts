import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-train-val-test',
  summary:
    'Train học tham số, Validation dùng để chọn mô hình và siêu tham số, Test đo kết quả cuối cùng. Test set không dùng để tinh chỉnh.',
  tags: ['Chia dữ liệu', 'Test set', 'Rò rỉ'],
  related: ['eval-cross-validation', 'eval-overfitting', 'eda-leakage', 'dq-time-series'],
  sections: {
    definition: `**Train / Validation / Test (Ba tập dữ liệu)** là cách chia dữ liệu theo ba vai trò: **Train** học tham số, **Validation** phục vụ các quyết định về mô hình, **Test** đo kết quả trên dữ liệu chưa ảnh hưởng tới quyết định nào.`,

    origin: `Đo trên dữ liệu đã học cho kết quả quá lạc quan, nên người ta tách một tập kiểm tra. Nhưng chỉnh siêu tham số theo điểm trên tập đó lại làm thông tin của nó rò vào mô hình. Tập thứ ba ra đời để giữ một phép đo trung thực.`,

    whyUse: `Mỗi quyết định dựa trên một tập dữ liệu đều làm tập đó bớt khách quan. Tách vai trò giúp bạn có một con số đáng tin để báo cáo.`,

    mechanism: `1. **Chia trước mọi bước khác,** vì co giãn hay chọn đặc trưng cũng học từ dữ liệu.
2. **Train:** học tham số và fit tiền xử lý.
3. **Validation:** chọn mô hình, siêu tham số, đặc trưng, ngưỡng.
4. **Test:** đo một lần sau khi đã chốt. Nếu sửa mô hình sau khi nhìn kết quả, cần một tập Test mới.

Cách chia phải giống thực tế: dự báo tương lai thì chia theo thời gian.`,

    diagram: {
      mermaid: `flowchart TD
  A["Toàn bộ dữ liệu"] --> B["Train: học tham số"]
  A --> C["Validation: chọn mô hình, ngưỡng"]
  A --> D["Test: khóa lại, chưa nhìn"]
  B --> C
  C --> E["Chốt cấu hình"]
  E --> D
  D --> F["Báo cáo một con số, không sửa tiếp"]`,
      caption: 'Thông tin chỉ đi một chiều. Kết quả Test không được quay lại ảnh hưởng tới mô hình.',
    },

    example: `Chia 100.000 khách hàng thành 70.000, 15.000 và 15.000. Cấu hình tốt nhất trong 200 cấu hình đạt AUC 0,84 trên Validation, nhưng chỉ 0,81 trên Test. Khoảng chênh một phần do chọn giá trị cao nhất trong 200 phép đo có nhiễu. Chọn bằng Test thì không còn cách nào phát hiện điều đó.`,

    prosCons: {
      pros: ['Đơn giản, mỗi cấu hình chỉ huấn luyện một lần.', 'Giữ được một con số trung thực.'],
      cons: ['Dữ liệu ít thì kết quả phụ thuộc nhiều vào cách chia.'],
    },

    whenToUse: {
      use: ['Dữ liệu đủ lớn để một lần chia đã ổn định.', 'Mô hình huấn luyện quá tốn để chạy nhiều fold.'],
      avoid: [
        'Dữ liệu ít: dùng [[eval-cross-validation]].',
        'Không chia ngẫu nhiên khi có thứ tự thời gian hoặc nhóm phụ thuộc.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Train', 'Validation', 'Test'],
      rows: [
        ['Mục đích', 'Học tham số', 'Ra quyết định', 'Báo cáo'],
        ['Ảnh hưởng tới mô hình', 'Trực tiếp', 'Gián tiếp', 'Không được phép'],
      ],
    },

    misconceptions: [
      {
        myth: 'Chỉ cần không huấn luyện trên Test thì Test vẫn sạch.',
        truth: 'Dùng Test để chọn siêu tham số, ngưỡng hay đặc trưng cũng là rò rỉ. Mô hình không học từ Test, nhưng quyết định của bạn thì có.',
      },
      {
        myth: 'Tỷ lệ 80/10/10 là chuẩn cho mọi bài toán.',
        truth: 'Điều cần là mỗi tập đủ dữ liệu, nhất là đủ ca dương. Với hàng trăm triệu dòng, 1% đã rất nhiều.',
      },
    ],
  },
})
