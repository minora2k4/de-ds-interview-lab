import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-fe-standardization-01',
    topicId: 'features',
    category: 'fe-scaling',
    conceptIds: ['fe-standardization'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Vì sao một số mô hình cần co giãn đặc trưng, còn cây quyết định thì không?',
    referenceAnswer: `Câu trả lời nằm ở việc mô hình dùng giá trị của đặc trưng như thế nào.

KNN và SVM với kernel RBF tính khoảng cách. Nếu thu nhập tính theo đồng và tuổi tính theo năm, khoảng cách gần như chỉ phản ánh thu nhập. PCA tìm hướng có phương sai lớn, nên cũng bị cột có con số lớn chi phối. Mô hình tuyến tính có điều chuẩn phạt độ lớn hệ số, mà hệ số lại phụ thuộc đơn vị, nên cột có đơn vị khác nhau bị phạt không công bằng. Với gradient descent, thang đo chênh lệch làm bề mặt mất mát bị kéo dài và hội tụ chậm.

Cây quyết định khác hẳn. Cây chỉ hỏi giá trị lớn hơn hay nhỏ hơn một ngưỡng. Phép co giãn giữ nguyên thứ tự, nên các phép chia có thể đạt được vẫn như cũ. Do đó cây và các mô hình dựa trên cây không cần co giãn.

Hồi quy tuyến tính không điều chuẩn là trường hợp đáng chú ý: dự đoán không đổi vì hệ số tự co lại, nhưng co giãn giúp so sánh hệ số dễ hơn.`,
    keyPoints: [
      { text: 'Mô hình dựa trên khoảng cách, phương sai bị cột lớn chi phối', keywords: ['khoảng cách', 'knn', 'svm', 'pca', 'phương sai'], weight: 2 },
      { text: 'Điều chuẩn phạt hệ số, phụ thuộc đơn vị', keywords: ['điều chuẩn', 'regularization', 'mức phạt', 'lasso', 'ridge'], weight: 2 },
      { text: 'Cây chỉ dùng thứ tự qua ngưỡng', keywords: ['ngưỡng', 'thứ tự', 'cây'], weight: 2 },
      { text: 'Gradient descent hội tụ chậm', keywords: ['gradient descent', 'hội tụ'] },
    ],
    followUps: ['Hồi quy tuyến tính không điều chuẩn có cần co giãn không?', 'XGBoost có cần không?'],
    commonMistakes: ['Nói mọi mô hình đều cần co giãn.', 'Chỉ nói cột lớn "quan trọng hơn" mà không nêu cơ chế.'],
  },
  {
    id: 'iv-fe-standardization-02',
    topicId: 'features',
    category: 'fe-scaling',
    conceptIds: ['fe-standardization', 'eda-leakage', 'eval-cross-validation'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao chỉ được `fit` scaler trên tập train? Nếu `fit` trên toàn bộ dữ liệu thì hậu quả cụ thể là gì?',
    referenceAnswer: `Tập test mô phỏng dữ liệu tương lai, và mô hình lúc huấn luyện không thể biết về nó. \`mean\` và \`std\` là thông tin rút ra từ dữ liệu, nên \`fit\` trên toàn bộ dữ liệu là để thống kê của test đi vào huấn luyện. Rò rỉ không nhất thiết phải đến từ nhãn.

Quy trình đúng là chia dữ liệu trước, \`fit\` trên train, rồi \`transform\` train và test bằng đúng tham số đó. Khi kiểm định chéo, mỗi fold phải \`fit\` lại. Tôi đặt scaler trong \`Pipeline\` để việc này tự động.

Về hậu quả, cần nói thật về mức độ. Với \`StandardScaler\` trên dữ liệu lớn, chênh lệch thường nhỏ, vì \`mean\` và \`std\` gần như nhau. Nhưng nó nghiêm trọng hơn khi dữ liệu nhỏ, có ngoại lai, hoặc có yếu tố thời gian: chuẩn hóa bằng cả chuỗi là đưa thông tin tương lai vào quá khứ. Và thói quen này sẽ gây hại lớn ở các bước dùng nhãn. Ví dụ của scikit-learn: chọn đặc trưng trên toàn bộ dữ liệu ngẫu nhiên cho độ chính xác 0.76, trong khi đúng phải là 0.5.

Lỗi ngược lại cũng sai: \`fit\` riêng trên test làm hai tập có hai thang đo khác nhau.`,
    keyPoints: [
      { text: 'Test mô phỏng tương lai, thống kê của test không được đi vào huấn luyện', keywords: ['tương lai', 'thống kê của test', 'rò rỉ', 'leakage'], weight: 3 },
      { text: 'Chia trước, fit trên train, transform cả hai', keywords: ['chia trước', 'fit trên train', 'transform'], weight: 2 },
      { text: 'Dùng Pipeline, fit lại ở mỗi fold', keywords: ['pipeline', 'mỗi fold', 'từng fold'], weight: 2 },
      { text: 'Mức độ phụ thuộc cỡ dữ liệu và loại bước', keywords: ['dữ liệu nhỏ', 'mức độ', 'chênh lệch nhỏ', 'chuỗi thời gian'] },
    ],
    followUps: ['Vì sao không `fit` riêng trên test?', 'Với chuỗi thời gian thì làm thế nào?'],
    commonMistakes: ['Cho rằng không dùng nhãn thì không thể rò rỉ.', 'Phóng đại rằng lỗi này luôn làm sai lệch rất lớn.'],
  },
  {
    id: 'iv-fe-standardization-03',
    topicId: 'features',
    category: 'fe-scaling',
    conceptIds: ['fe-standardization', 'dq-drift'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Ở production, tham số co giãn nên được quản lý thế nào? Có nên tính lại `mean` và `std` theo từng lô dữ liệu mới không?',
    referenceAnswer: `Tôi xem tham số co giãn là một phần của mô hình. Chúng được lưu và phiên bản hóa cùng mô hình, tốt nhất là trong một \`Pipeline\` duy nhất, để huấn luyện và chấm điểm dùng đúng một logic. Sai lệch giữa hai môi trường là nguồn lỗi rất phổ biến.

Tôi không tính lại theo lô. Mô hình học hệ số trên một thang đo cố định. Nếu co giãn theo lô, một lô chỉ có khách thu nhập cao sẽ được đưa về quanh 0, và mô hình thấy họ như khách bình thường. Tức là ta xóa mất chính tín hiệu cần dùng. Kết quả còn phụ thuộc vào việc ai nằm cùng lô.

Khi phân phối đổi thật, tôi xử lý bằng giám sát: theo dõi PSI hoặc thống kê của từng đặc trưng. Nếu trôi đáng kể và hiệu năng giảm, tôi huấn luyện lại, học tham số mới, đánh giá trên dữ liệu gần nhất rồi triển khai có kiểm soát.

Với mô hình online học liên tục có thể dùng thống kê cập nhật dần, nhưng khi đó thang đo đổi chậm cùng với mô hình, không phải chỉ đổi riêng đầu vào.`,
    keyPoints: [
      { text: 'Tham số là một phần của mô hình, lưu và phiên bản hóa', keywords: ['phiên bản', 'lưu', 'pipeline', 'một phần của mô hình'], weight: 2 },
      { text: 'Không tính lại theo lô vì đổi thang đo, xóa tín hiệu', keywords: ['thang đo', 'theo lô', 'xóa', 'tín hiệu'], weight: 3 },
      { text: 'Giám sát trôi dữ liệu và huấn luyện lại', keywords: ['psi', 'trôi', 'drift', 'huấn luyện lại', 'giám sát'], weight: 2 },
    ],
    followUps: ['Làm sao phát hiện sai lệch giữa lúc huấn luyện và lúc chấm điểm?', 'Khi nào học lại tham số?'],
    commonMistakes: ['Tính lại theo lô để "cập nhật" mô hình.', 'Viết lại logic co giãn riêng ở hệ thống chấm điểm.'],
  },
  {
    id: 'iv-fe-normalization-01',
    topicId: 'features',
    category: 'fe-scaling',
    conceptIds: ['fe-normalization', 'fe-standardization', 'fe-minmax'],
    interviewTypes: ['ds'],
    levels: ['junior'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Standardization và Normalization khác nhau thế nào?',
    referenceAnswer: `Trước hết, tôi nói rõ rằng hai thuật ngữ này thường bị dùng lẫn lộn, nên tôi sẽ nêu công thức.

Standardization là \`(x - mean) / std\`, cho trung bình 0 và độ lệch chuẩn 1, không có biên trên hay dưới. Nhiều tài liệu lại gọi cách này là z-score normalization.

Normalization trong nhiều giáo trình là Min-Max: \`(x - min) / (max - min)\`, đưa về khoảng 0 đến 1. Nhưng trong scikit-learn, Normalization lại là đưa từng dòng về độ dài 1 bằng \`Normalizer\`, còn Min-Max được xếp trong mục Standardization. Vì vậy, nói tên không đủ.

Khác biệt thực tế là: Min-Max có biên nhưng rất nhạy với ngoại lai, vì max quyết định thang đo. Standardization không có biên, đỡ nhạy hơn nhưng vẫn bị ảnh hưởng. Cả hai đều chỉ dịch và co giãn, không biến dữ liệu thành phân phối chuẩn. Còn Normalizer làm theo dòng, nên dùng cho bài toán khác như so sánh văn bản bằng cosine similarity.`,
    keyPoints: [
      { text: 'Hai thuật ngữ thường bị dùng lẫn lộn', keywords: ['lẫn lộn', 'nhiều nghĩa', 'z-score normalization'], weight: 2 },
      { text: 'Nêu công thức z-score và min-max', keywords: ['mean', 'std', 'min', 'max'], weight: 2 },
      { text: 'Normalizer của scikit-learn làm theo dòng', keywords: ['theo dòng', 'normalizer', 'độ dài 1', 'từng dòng'], weight: 2 },
      { text: 'Không tạo phân phối chuẩn', keywords: ['phân phối chuẩn', 'không đổi hình dạng'] },
    ],
    followUps: ['Khi nào chọn Min-Max thay vì Standardization?'],
    commonMistakes: ['Khẳng định một định nghĩa duy nhất cho Normalization.', 'Nói Standardization tạo ra phân phối chuẩn.'],
  },
  {
    id: 'iv-fe-minmax-01',
    topicId: 'features',
    category: 'fe-scaling',
    conceptIds: ['fe-minmax', 'fe-robust'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Min-Max Scaling hoạt động thế nào? Vì sao nó nhạy với ngoại lai, và khi nào nên dùng?',
    referenceAnswer: `Min-Max dùng công thức \`(x - min) / (max - min)\`, đưa mỗi cột về khoảng 0 đến 1 trên tập train. Phép biến đổi là tuyến tính nên giữ nguyên hình dạng phân phối.

Nó nhạy với ngoại lai vì toàn bộ thang đo chỉ do hai giá trị quyết định. Ví dụ cột có giá trị từ 20 đến 60 và một ngoại lai 2.000: sau co giãn, các giá trị bình thường chỉ nằm trong khoảng 0 đến 0.02, và mô hình dựa trên khoảng cách gần như không phân biệt được chúng.

Một điểm dễ quên là dữ liệu mới có thể vượt khoảng. Vì min, max học từ train, giá trị lớn hơn max sẽ cho kết quả lớn hơn 1. Không được tính lại trên test, vì thang đo sẽ khác.

Tôi dùng Min-Max khi dữ liệu có biên tự nhiên như điểm ảnh từ 0 đến 255, hoặc khi thuật toán cần đầu vào trong một khoảng cố định. Nếu có ngoại lai, tôi xử lý trước hoặc dùng Robust Scaling.`,
    keyPoints: [
      { text: 'Công thức min, max và khoảng 0 đến 1', keywords: ['min', 'max', '0 đến 1'], weight: 2 },
      { text: 'Hai cực trị quyết định thang đo nên nhạy với ngoại lai', keywords: ['ngoại lai', 'outlier', 'cực trị', 'nén'], weight: 2 },
      { text: 'Dữ liệu mới có thể vượt khoảng', keywords: ['vượt khoảng', 'lớn hơn 1', 'ngoài khoảng', 'clip'] },
      { text: 'Dùng khi có biên tự nhiên', keywords: ['biên tự nhiên', 'điểm ảnh', 'pixel', 'khoảng cố định'] },
    ],
    followUps: ['Với ma trận thưa thì dùng cách nào?'],
    commonMistakes: ['Khẳng định kết quả luôn nằm trong 0 đến 1 ở mọi tập.'],
  },
  {
    id: 'iv-fe-robust-01',
    topicId: 'features',
    category: 'fe-scaling',
    conceptIds: ['fe-robust', 'fe-standardization', 'eda-outliers'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Từ nguyên lý, vì sao Robust Scaling ít bị ngoại lai ảnh hưởng hơn Standardization? Nó có thay thế được việc xử lý ngoại lai không?',
    referenceAnswer: `Khác biệt nằm ở thống kê được dùng. Standardization dùng \`mean\` và \`std\`, phụ thuộc vào mọi giá trị. Một giá trị cực lớn kéo \`mean\` lên và làm \`std\` tăng mạnh hơn nữa vì độ lệch được bình phương. Hậu quả là các giá trị bình thường bị nén lại gần nhau.

Robust Scaling dùng median và \`IQR = Q3 - Q1\`. Các thống kê này chỉ phụ thuộc vào thứ hạng, nên đổi giá trị lớn nhất thành bao nhiêu cũng không làm chúng thay đổi. Thang đo do phần giữa của dữ liệu quyết định.

Ví dụ cột gồm 20 đến 60 và một giá trị 2.000. Standardization đưa các giá trị bình thường về khoảng -0.37 đến -0.30. Robust Scaling giữ chúng ở -1.00 đến 0.78, nhưng ngoại lai thành 87.

Vậy nó không thay thế được việc xử lý ngoại lai. Ngoại lai vẫn còn, và với mô hình tuyến tính hay KNN, giá trị 87 vẫn gây ảnh hưởng lớn. Tôi vẫn phải tìm hiểu nguyên nhân: nếu là lỗi thì sửa, nếu là thật thì có thể log hoặc cắt ngưỡng. Ngoài ra, cột có phần lớn giá trị bằng 0 sẽ có IQR bằng 0, nên không dùng được cách này.`,
    keyPoints: [
      { text: 'mean, std phụ thuộc mọi giá trị và độ lệch bình phương', keywords: ['mọi giá trị', 'bình phương', 'mean', 'std'], weight: 2 },
      { text: 'Median, IQR dựa trên thứ hạng', keywords: ['thứ hạng', 'median', 'iqr', 'tứ phân vị'], weight: 3 },
      { text: 'Ngoại lai vẫn còn, cần xử lý riêng', keywords: ['vẫn còn', 'không loại bỏ', 'cắt ngưỡng', 'log'], weight: 2 },
      { text: 'IQR có thể bằng 0', keywords: ['iqr bằng 0', 'bằng 0'] },
    ],
    followUps: ['Khi nào nên dùng phân vị khác 25 và 75?', 'Cột có 85% số 0 thì xử lý thế nào?'],
    commonMistakes: ['Nói Robust Scaling loại bỏ ngoại lai.', 'Không giải thích được vì sao median bền hơn mean.'],
  },
])
