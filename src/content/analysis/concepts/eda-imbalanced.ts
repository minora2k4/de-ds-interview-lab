import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-imbalanced',
  summary:
    'Dữ liệu mất cân bằng khi một lớp rất hiếm. Trước hết phải chọn đúng chỉ số và ngưỡng, sau đó mới cân nhắc Class Weight hay SMOTE trên tập train. Tập validation và test luôn giữ tỷ lệ tự nhiên.',
  tags: ['Mất cân bằng', 'Đánh giá', 'First Principles'],
  related: ['eval-pr-auc', 'eval-calibration', 'eval-accuracy', 'eda-leakage', 'eda-sampling', 'eval-roc-auc', 'eval-confusion-matrix'],
  sections: {
    definition: `**Imbalanced Data (Dữ liệu mất cân bằng)** là dữ liệu phân loại trong đó một lớp chiếm tỷ lệ rất nhỏ, như gian lận 0,5%. Tỷ lệ này không phải lỗi, mà là sự thật về thế giới. Khó khăn thật nằm ở ba chỗ: **ít mẫu dương tuyệt đối**, **chỉ số dễ đánh lừa** và **ngưỡng mặc định không phù hợp**.

Vì vậy 1% trên 10 triệu dòng dễ hơn nhiều so với 1% trên 5.000 dòng: một bên có 100.000 mẫu dương, bên kia chỉ có 50.`,

    origin: `Khi accuracy là chỉ số mặc định, mô hình đoán toàn lớp đa số đã có điểm rất cao. Phản ứng đầu tiên là cân bằng lại dữ liệu, nhưng nhân bản mẫu hiếm dễ làm mô hình ghi nhớ. SMOTE (Chawla và cộng sự, 2002) tạo mẫu tổng hợp để khắc phục điều đó.

Các nghiên cứu sau đặt lại câu hỏi. Elor và Averbuch-Elor (2022) thấy với bộ phân loại mạnh, cân bằng không cải thiện kết quả, còn tối ưu ngưỡng cho chất lượng tương tự và đơn giản hơn. van den Goorbergh và cộng sự (2022) thấy với hồi quy logistic, các cách cân bằng không tăng AUC và làm xác suất lớp hiếm bị đánh giá quá cao.`,

    whyUse: `Xử lý đúng giúp mô hình phục vụ quyết định thật: bắt được bao nhiêu ca hiếm, với bao nhiêu báo động sai. Xử lý sai cho chỉ số đẹp nhưng vô dụng.`,

    mechanism: `Thứ tự nên làm:

1. **Chọn chỉ số theo quyết định.** Dùng [[eval-pr-auc|PR-AUC]], Recall tại mức Precision cố định, hoặc chi phí kỳ vọng. Mốc của mô hình ngẫu nhiên trên đường PR bằng tỷ lệ dương, không phải 0,5.
2. **Giữ tỷ lệ tự nhiên khi đánh giá.** Dùng [[eda-sampling|Stratified Sampling]] để mọi fold có đủ mẫu hiếm.
3. **Chạy baseline, rồi đổi ngưỡng.** Ngưỡng theo chi phí là \`C_FP / (C_FP + C_FN)\`, với xác suất đã được [[eval-calibration|hiệu chỉnh]].
4. **Class Weight:** phạt nặng hơn lỗi ở lớp hiếm, không đổi dữ liệu. Mức \`balanced\` của scikit-learn là \`n_samples / (n_classes × số mẫu của lớp)\`. Với 990 âm và 10 dương, lớp dương có trọng số 50, lớp âm khoảng 0,505.
5. **Resampling, chỉ trên train.** Undersampling bỏ bớt lớp đa số. Oversampling nhân bản lớp hiếm. **SMOTE** nội suy giữa một mẫu hiếm và một láng giềng cùng lớp (mặc định 5 láng giềng trong imbalanced-learn). Vì dựa trên khoảng cách và nội suy, SMOTE gốc hợp với biến số; dữ liệu có biến phân loại cần SMOTENC hoặc SMOTEN.

**Vì sao không resampling trên validation và test:** tập đánh giá phải giống dữ liệu thật, vì Precision phụ thuộc tỷ lệ dương. Mẫu tổng hợp cũng không phải ca thật. Nếu resampling trước khi tách, mẫu tổng hợp được tạo từ các điểm sau đó rơi vào test, đây là [[eda-leakage|rò rỉ]]. Trong Cross Validation, resampling chỉ chạy trên phần train của mỗi fold, nên đặt trong pipeline của imbalanced-learn.

**Chi phí ẩn:** Class Weight và resampling làm xác suất dự đoán lệch lên cho lớp hiếm. Nếu cần xác suất thật, như để định giá rủi ro, phải hiệu chỉnh lại.`,

    diagram: {
      mermaid: `flowchart TD
  A["Dữ liệu gốc, tỷ lệ tự nhiên"] --> B["Tách train, validation, test"]
  B --> C["Train: có thể dùng Class Weight hoặc Resampling"]
  B --> D["Validation, test: giữ nguyên tỷ lệ"]
  C --> E["Huấn luyện mô hình"]
  E --> F["Chọn ngưỡng trên validation, báo cáo trên test"]
  D --> F`,
      caption: 'Mọi can thiệp vào tỷ lệ lớp chỉ nằm ở nhánh train. Nhánh đánh giá phải phản ánh dữ liệu thật.',
    },

    example: `1 triệu giao dịch có 5.000 gian lận (0,5%). Mô hình đoán toàn "không gian lận" đã đạt accuracy 99,5%.

Một mô hình có Recall 80% và tỷ lệ báo động sai 1% cho 4.000 ca đúng và 9.950 báo động sai, nên Precision là **28,7%**. Nếu test bị cân bằng về 5.000 và 5.000, cùng mô hình đó chỉ có 50 báo động sai, và Precision thành **98,8%**. Mô hình không đổi, chỉ con số bị thổi phồng.

Bỏ sót một ca mất 5 triệu đồng, kiểm tra một báo động tốn 20 nghìn đồng, nên ngưỡng hợp lý theo chi phí chỉ khoảng 0,4%, rất xa mức 0,5 mặc định.`,

    prosCons: {
      pros: [
        '**Đổi ngưỡng** đơn giản, rẻ, giữ nguyên xác suất của mô hình.',
        '**Class Weight** không đổi dữ liệu.',
        '**Undersampling** giảm mạnh thời gian huấn luyện trên dữ liệu rất lớn.',
      ],
      cons: [
        '**Resampling và Class Weight** làm lệch xác suất, cần hiệu chỉnh nếu dùng xác suất.',
        '**SMOTE** không tạo thêm thông tin, có thể sinh mẫu phi lý và kém hiệu quả khi nhiều chiều.',
        '**Undersampling** bỏ dữ liệu thật, làm kết quả dao động hơn.',
      ],
    },

    whenToUse: {
      use: [
        'Bắt đầu bằng chỉ số đúng và đổi ngưỡng, rồi mới thêm kỹ thuật khác nếu cải thiện rõ trên validation.',
        'Dùng undersampling khi dữ liệu quá lớn để huấn luyện.',
        'Thử resampling với mô hình yếu hoặc khi có rất ít mẫu dương.',
      ],
      avoid: [
        'Không resampling trên validation hoặc test, và không resampling trước khi tách.',
        'Không cân bằng về 50:50 theo thói quen khi cần xác suất đáng tin.',
      ],
    },

    comparison: {
      headers: ['Cách làm', 'Cơ chế', 'Rủi ro chính'],
      rows: [
        ['Đổi ngưỡng', 'Giữ mô hình, đổi điểm cắt', 'Cần xác suất tốt, chọn trên validation'],
        ['Class Weight', 'Phạt nặng lỗi lớp hiếm', 'Xác suất bị lệch'],
        ['Random Undersampling', 'Bỏ bớt lớp đa số', 'Mất thông tin, dao động cao'],
        ['Random Oversampling', 'Nhân bản lớp hiếm', 'Dễ ghi nhớ mẫu hiếm'],
        ['SMOTE', 'Nội suy mẫu tổng hợp', 'Mẫu phi lý, kém với biến phân loại'],
      ],
      note: 'Elor và Averbuch-Elor (2022) cũng ghi nhận Random Oversampling hiệu quả tương đương các biến thể SMOTE khi cần cân bằng, trên 73 bộ dữ liệu.',
    },

    misconceptions: [
      {
        myth: 'Dữ liệu mất cân bằng thì phải đưa về 50:50.',
        truth: 'Tỷ lệ tự nó không phải lỗi. Nhiều trường hợp đổi ngưỡng cho kết quả tương tự mà không làm hỏng xác suất.',
      },
      {
        myth: 'SMOTE tạo ra thông tin mới.',
        truth: 'SMOTE chỉ nội suy giữa các điểm đã có.',
      },
      {
        myth: 'Cân bằng tập test giúp đánh giá công bằng hơn.',
        truth: 'Làm vậy khiến Precision và PR-AUC không còn phản ánh thực tế. ',
      },
    ],
  },
})
