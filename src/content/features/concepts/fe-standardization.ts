import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-standardization',
  summary:
    'Standardization trừ trung bình rồi chia cho độ lệch chuẩn, đưa mỗi cột về trung bình 0 và độ lệch chuẩn 1 mà không đổi hình dạng phân phối. Hai tham số này chỉ được học trên tập train để tránh rò rỉ.',
  tags: ['Co giãn', 'Rò rỉ dữ liệu', 'Pipeline', 'First Principles'],
  related: ['fe-normalization', 'fe-minmax', 'fe-robust', 'eda-leakage', 'eval-cross-validation', 'stats-variance-std'],
  sections: {
    definition: `**Standardization (Chuẩn hóa về trung bình 0, độ lệch chuẩn 1)** biến đổi từng cột theo công thức:

\`z = (x - mean) / std\`

Kết quả cho biết giá trị cách trung bình bao nhiêu độ lệch chuẩn. Đây là phép biến đổi tuyến tính, nên **không làm đổi hình dạng phân phối**: cột lệch phải vẫn lệch phải sau khi co giãn.

**Thuật ngữ dễ lẫn.** Nhiều tài liệu gọi cách này là z-score normalization, còn một số người dùng "normalization" để chỉ mọi kiểu co giãn. Khi trao đổi, hãy nói rõ công thức, xem thêm [[fe-normalization]].`,

    origin: `Các cột thường có đơn vị rất khác nhau, ví dụ tuổi vài chục và thu nhập vài trăm triệu. Những thuật toán dựa trên khoảng cách, phương sai hoặc độ lớn hệ số sẽ bị cột có con số lớn chi phối. Standardization đưa các cột về cùng đơn vị là "số độ lệch chuẩn", nên việc so sánh không còn phụ thuộc vào đơn vị đo.`,

    whyUse: `Tác dụng phụ thuộc vào loại mô hình:

- **KNN, SVM với kernel RBF, PCA:** khoảng cách và phương sai bị cột lớn chi phối. Không co giãn sẽ cho kết quả sai bản chất.
- **Mô hình có điều chuẩn:** mức phạt tính trên độ lớn hệ số, mà độ lớn hệ số lại phụ thuộc đơn vị. Đổi thu nhập từ đồng sang triệu đồng làm hệ số thay đổi và mức phạt cũng đổi theo.
- **Mô hình huấn luyện bằng gradient descent:** thang đo chênh lệch làm bề mặt mất mát bị kéo dài, nên hội tụ chậm.
- **Hồi quy tuyến tính không điều chuẩn:** dự đoán không đổi, chỉ hệ số co lại theo đơn vị.
- **Cây quyết định:** chỉ so sánh ngưỡng, và phép co giãn giữ nguyên thứ tự, nên cây không bị ảnh hưởng.`,

    mechanism: `**Chỉ học tham số trên tập train.** \`mean\` và \`std\` là thông tin rút ra từ dữ liệu. Nếu tính trên toàn bộ dữ liệu, thông tin của test đã đi vào quá trình huấn luyện. Tài liệu scikit-learn nêu rõ quy tắc: không bao giờ gọi \`fit\` trên dữ liệu test.

1. Chia train và test **trước** mọi bước tiền xử lý.
2. \`fit\` trên train để lấy \`mean\`, \`std\`.
3. \`transform\` cả train, test và production bằng **đúng hai số đó**.

**Kiểm định chéo** phải học lại ở từng fold, vì mỗi fold có một tập train riêng. Đặt scaler trong \`Pipeline\` để việc này tự động và khó sai.

**Dữ liệu thời gian:** chỉ dùng tham số từ quá khứ. Chuẩn hóa bằng cả chuỗi là đưa thông tin tương lai vào.

**Production** phải lưu tham số cùng mô hình. Tính lại theo từng lô là sai: lô chỉ có khách hàng thu nhập cao sẽ được co về quanh 0, và mô hình không còn thấy họ có thu nhập cao.

**Lưu ý kỹ thuật:**

- \`StandardScaler\` dùng độ lệch chuẩn tổng thể (\`ddof=0\`), và lựa chọn này ít ảnh hưởng đến hiệu năng.
- Với ma trận thưa, trừ trung bình sẽ làm mất tính thưa, nên phải dùng \`with_mean=False\`.
- \`mean\` và \`std\` đều nhạy với ngoại lai, vì \`std\` bình phương độ lệch. Khi có nhiều ngoại lai, cân nhắc [[fe-robust]].`,

    diagram: {
      mermaid: `flowchart TD
  A["Toàn bộ dữ liệu"] --> B["Chia train và test trước"]
  B --> C["fit trên train: lấy mean, std"]
  C --> D["transform train"]
  C --> E["transform test bằng cùng tham số"]
  C --> F["Lưu tham số cho production"]
  D --> G["Huấn luyện mô hình"]`,
      caption: 'Mọi tham số đều xuất phát từ tập train. Test và production chỉ dùng lại, không học thêm.',
    },

    example: `Một mô hình KNN dự đoán rời bỏ có \`tuổi\` (20 đến 60) và \`thu nhập\` (5 đến 100 triệu, lưu theo đồng). Hai khách hàng lệch nhau 30 tuổi nhưng thu nhập giống hệt có khoảng cách 30, còn hai khách hàng cùng tuổi lệch 1 triệu đồng có khoảng cách 1.000.000. Tuổi gần như không có vai trò gì.

Sau khi co giãn với \`mean\` tuổi 40, \`std\` 10 và \`mean\` thu nhập 30 triệu, \`std\` 20 triệu, lệch 30 tuổi thành 3 đơn vị, còn lệch 1 triệu thành 0.05 đơn vị. Độ chính xác trên test tăng từ 0.68 lên 0.79.

Tài liệu scikit-learn minh họa thêm hậu quả khi quên co giãn test: cùng một mô hình hồi quy, MSE là 62.80 nếu test chưa \`transform\`, và 0.90 nếu \`transform\` đúng.`,

    prosCons: {
      pros: [
        '**Không giới hạn khoảng giá trị,** nên giá trị mới ngoài khoảng train không phá vỡ thang đo.',
        '**Cho thang đo có ý nghĩa:** dễ đọc mức lệch so với trung bình.',
      ],
      cons: [
        '**Nhạy với ngoại lai:** một giá trị cực lớn làm lệch cả `mean` và `std`.',
        '**Không sửa độ lệch của phân phối,** nên cột rất lệch có thể cần log hoặc biến đổi khác trước.',
      ],
    },

    whenToUse: {
      use: [
        'KNN, SVM, PCA, mô hình có điều chuẩn và mô hình huấn luyện bằng gradient descent.',
        'Cột có phân phối tương đối cân đối, ít ngoại lai.',
      ],
      avoid: [
        'Mô hình cây, vì không thay đổi kết quả mà thêm một bước vận hành.',
        'Khi có nhiều ngoại lai mà không xử lý trước, nên xem [[fe-robust]].',
      ],
    },

    comparison: {
      headers: ['Cách co giãn', 'Công thức', 'Khoảng kết quả', 'Với ngoại lai'],
      rows: [
        ['Standardization', '(x - mean) / std', 'Không giới hạn', 'Nhạy'],
        ['[[fe-minmax|Min-Max]]', '(x - min) / (max - min)', 'Thường là 0 đến 1', 'Rất nhạy'],
        ['[[fe-robust|Robust Scaling]]', '(x - median) / IQR', 'Không giới hạn', 'Bền'],
      ],
    },

    misconceptions: [
      {
        myth: 'Standardization biến dữ liệu thành phân phối chuẩn.',
        truth: 'Nó chỉ dịch và co giãn, không đổi hình dạng. Muốn tiến gần phân phối chuẩn phải dùng biến đổi phi tuyến như Box-Cox hoặc Yeo-Johnson.',
      },
      {
        myth: 'Co giãn trên toàn bộ dữ liệu không sao, vì không dùng nhãn.',
        truth: 'Rò rỉ không chỉ đến từ nhãn. Thống kê của test đi vào huấn luyện vẫn làm đánh giá thiếu trung thực, dù mức độ thường nhỏ hơn rò rỉ nhãn.',
      },
      {
        myth: 'Mọi mô hình đều cần co giãn.',
        truth: 'Cây và các mô hình dựa trên cây chỉ dùng thứ tự giá trị, nên không cần.',
      },
    ],
  },
})
