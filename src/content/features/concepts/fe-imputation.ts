import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-imputation',
  summary:
    'Imputation điền giá trị thiếu để mô hình dùng được dữ liệu. Tham số chỉ học trên train, và nên giữ lại thông tin rằng giá trị từng bị thiếu.',
  tags: ['Giá trị thiếu', 'Rò rỉ dữ liệu', 'Tiền xử lý'],
  related: ['eda-missing-values', 'eda-leakage', 'fe-standardization', 'fe-binning'],
  sections: {
    definition: `**Imputation (Điền giá trị thiếu)** thay giá trị thiếu bằng một giá trị ước lượng. Cách làm **đơn biến** chỉ dùng chính cột đó, còn cách làm **đa biến** dùng các cột khác để ước lượng. Cơ chế thiếu xem ở [[eda-missing-values]].`,

    origin: `Nhiều thuật toán không nhận giá trị thiếu, còn xóa dòng thì mất dữ liệu và làm mẫu thiên lệch nếu việc thiếu không ngẫu nhiên. Imputation giữ lại các dòng đó.`,

    whyUse: `Giữ được dữ liệu và chạy được mô hình. Một số mô hình như \`HistGradientBoosting\` nhận trực tiếp giá trị thiếu, nên không phải lúc nào cũng cần điền.`,

    mechanism: `**Các cách phổ biến:**

- **Thống kê của cột** (\`SimpleImputer\`): trung bình, trung vị, giá trị phổ biến nhất, hoặc hằng số.
- **KNN** (\`KNNImputer\`): lấy trung bình từ các dòng gần nhất. Phải co giãn trước, vì khoảng cách phụ thuộc thang đo.
- **Lặp** (\`IterativeImputer\`): lần lượt dự đoán từng cột từ các cột còn lại, lặp nhiều vòng. Trong scikit-learn 1.9, lớp này vẫn là thử nghiệm.

**Vì sao giữ cột chỉ báo?** Nếu thiếu có ý nghĩa, ví dụ người thu nhập cao không khai, điền giá trị sẽ xóa mất tín hiệu đó. \`add_indicator=True\` thêm một cột đánh dấu dòng từng bị thiếu.

**Điền làm méo dữ liệu.** Điền cùng một giá trị làm phương sai giảm và tương quan giữa các cột yếu đi.

**Chỉ học trên train.** Trung vị hay mô hình điền đều là thông tin từ dữ liệu, nên phải đặt trong \`Pipeline\`.`,

    diagram: {
      mermaid: `flowchart TD
  A["Cột có giá trị thiếu"] --> B["Mô hình nhận trực tiếp giá trị thiếu?"]
  B -->|"Có"| C["Có thể không cần điền"]
  B -->|"Không"| D["Học cách điền trên train"]
  D --> E["Thêm cột chỉ báo nếu thiếu có ý nghĩa"]
  E --> F["Áp dụng nguyên tham số cho test, production"]`,
      caption: 'Quyết định đầu tiên là có cần điền hay không. Mọi tham số đều học từ tập train.',
    },

    example: `Cột thu nhập thiếu 18%, lệch phải với trung bình 28 triệu và trung vị 14 triệu. Điền trung bình sẽ gán cho người thiếu mức cao gấp đôi người điển hình, nên trung vị hợp lý hơn. Tỷ lệ nợ xấu của nhóm thiếu là 9%, so với 4% ở nhóm còn lại, nên thêm cột chỉ báo.`,

    prosCons: {
      pros: ['Giữ được dòng dữ liệu.'],
      cons: ['Làm giảm phương sai và méo tương quan.'],
    },

    whenToUse: {
      use: ['Mô hình không nhận giá trị thiếu.', 'Dùng trung vị cho cột lệch, giá trị phổ biến nhất cho cột phân loại.'],
      avoid: ['Điền mà không xem vì sao dữ liệu thiếu.'],
    },

    comparison: {
      headers: ['Cách làm', 'Dùng cột khác', 'Chi phí'],
      rows: [
        ['Thống kê của cột', 'Không', 'Thấp'],
        ['KNN', 'Có', 'Cao khi dữ liệu lớn'],
        ['Lặp theo mô hình', 'Có', 'Cao'],
      ],
    },

    misconceptions: [
      {
        myth: 'Cách điền càng phức tạp thì mô hình càng tốt.',
        truth: 'Với mô hình mạnh, cách đơn giản kèm cột chỉ báo thường đủ tốt và dễ vận hành hơn.',
      },
    ],
  },
})
