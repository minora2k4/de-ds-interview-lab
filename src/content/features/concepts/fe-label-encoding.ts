import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-label-encoding',
  summary:
    'Label Encoding gán mỗi giá trị một số nguyên từ 0 đến k-1. Cách này hợp với nhãn y, nhưng khi dùng cho đặc trưng định danh, nó tạo ra thứ tự giả.',
  tags: ['Mã hóa', 'Biến phân loại', 'Thứ tự giả'],
  related: ['fe-one-hot', 'fe-ordinal-encoding', 'fe-woe'],
  sections: {
    definition: `**Label Encoding (Mã hóa nhãn thành số)** gán mỗi giá trị phân loại một số nguyên từ 0 đến k-1. Trong scikit-learn, \`LabelEncoder\` được thiết kế cho **biến mục tiêu y**. Đặc trưng X nên dùng \`OrdinalEncoder\` hoặc \`OneHotEncoder\`.`,

    origin: `Mô hình phân loại cần nhãn dạng số, và đây là cách gọn nhất. Vấn đề nảy sinh khi dùng lại nó cho đặc trưng để né số cột lớn của [[fe-one-hot]].`,

    whyUse: `Với y, cách này an toàn: mô hình xem mỗi số là một lớp riêng.`,

    mechanism: `Các giá trị thường được sắp theo chữ cái rồi đánh số: \`Cần Thơ = 0\`, \`Đà Nẵng = 1\`, \`Hà Nội = 2\`. Con số phản ánh cách sắp xếp, không phản ánh bản chất dữ liệu.

**Vì sao thứ tự giả gây hại khi dùng cho X:**

- **Mô hình tuyến tính** chỉ có một hệ số, nên buộc tác động tăng đều theo mã số.
- **KNN, SVM** tính khoảng cách trên mã số, nên Cần Thơ bị xem là gần Đà Nẵng hơn Hà Nội.
- **Cây** ít bị ảnh hưởng hơn, nhưng phải cắt theo thứ tự mã, nên tách một giá trị ở giữa cần nhiều lần chia.

\`fit\` lại trên dữ liệu có giá trị mới có thể làm các mã dịch đi, nên phải lưu ánh xạ cùng mô hình.`,

    example: `Hồi quy giá nhà dùng Label Encoding cho 5 quận. Hệ số gần 0, vì quận đắt và rẻ xen kẽ theo mã. Đổi sang One-Hot, RMSE giảm từ 820 triệu xuống 610 triệu.`,

    prosCons: {
      pros: ['Một cột duy nhất, không tăng số chiều.', 'Đúng và đủ cho nhãn y của bài toán phân loại.'],
      cons: ['Tạo thứ tự và khoảng cách giả với đặc trưng định danh.'],
    },

    whenToUse: {
      use: ['Mã hóa biến mục tiêu y trong bài toán phân loại.'],
      avoid: [
        'Đặc trưng định danh trong mô hình tuyến tính, KNN hoặc SVM.',
        'Biến có thứ bậc thật, vì thứ tự chữ cái thường sai: dùng [[fe-ordinal-encoding]].',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Label Encoding', 'Ordinal Encoding', 'One-Hot'],
      rows: [
        ['Phù hợp với', 'Nhãn y', 'Đặc trưng có thứ bậc', 'Đặc trưng định danh'],
        ['Thứ tự mã số', 'Theo sắp xếp', 'Theo thứ bậc thật', 'Không có'],
      ],
    },

    misconceptions: [
      {
        myth: 'Label Encoding và One-Hot chỉ khác nhau về số cột.',
        truth: 'Khác biệt cốt lõi là giả định: một bên áp đặt thứ tự, bên kia xem các giá trị độc lập.',
      },
      {
        myth: 'Dùng cây thì Label Encoding hoàn toàn vô hại.',
        truth: 'Cây vẫn phải cắt theo thứ tự mã, nên có thể sâu hơn.',
      },
    ],
  },
})
