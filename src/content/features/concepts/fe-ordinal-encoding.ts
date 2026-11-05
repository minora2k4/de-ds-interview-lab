import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-ordinal-encoding',
  summary:
    'Ordinal Encoding gán số nguyên theo thứ bậc thật. Phải tự khai báo thứ tự, và mô hình tuyến tính sẽ giả định các bậc cách đều nhau.',
  tags: ['Mã hóa', 'Biến phân loại', 'Thứ bậc'],
  related: ['fe-label-encoding', 'fe-one-hot', 'fe-binning'],
  sections: {
    definition: `**Ordinal Encoding (Mã hóa theo thứ bậc)** gán số nguyên theo thứ bậc thật, ví dụ \`Thấp = 0\`, \`Vừa = 1\`, \`Cao = 2\`. Biến thứ bậc có quan hệ lớn nhỏ rõ ràng, chỉ là không biết chính xác khoảng cách.`,

    origin: `[[fe-one-hot|One-Hot]] bỏ mất thông tin \`Cao > Vừa > Thấp\` và tốn nhiều cột. [[fe-label-encoding|Label Encoding]] đánh số theo cách sắp xếp, nên thường sai thứ tự. Ordinal Encoding giữ một cột và dùng thứ tự do nghiệp vụ khai báo.`,

    whyUse: `Mô hình dùng được thứ bậc mà không tốn thêm cột, và mỗi ngưỡng cắt của cây đều có ý nghĩa.`,

    mechanism: `**Phải khai báo thứ tự.** Với \`categories='auto'\`, \`OrdinalEncoder\` lấy giá trị từ dữ liệu train theo thứ tự sắp xếp, nên \`Cao, Thấp, Vừa\` thành \`0, 1, 2\`, sai với ý nghĩa.

**Giả định khoảng cách đều.** Mô hình tuyến tính xem bước từ 0 lên 1 bằng bước từ 1 lên 2. Nếu thực tế không như vậy, có thể dùng [[fe-one-hot]] hoặc gán giá trị có ý nghĩa như số năm học. Cây không gặp vấn đề này vì chỉ dùng thứ tự.

**Giá trị lạ và giá trị thiếu.** \`handle_unknown='use_encoded_value'\` gán mã riêng cho giá trị chưa gặp. Mã \`-1\` xếp nó xuống dưới mức thấp nhất, tức là thêm một giả định. Giá trị thiếu mặc định giữ nguyên là \`NaN\`.`,

    example: `Biến \`trình độ\` có 4 bậc. Để mặc định, thứ tự chữ cái làm sai bậc và hệ số gần 0. Khai báo đúng thứ tự, tỷ lệ nợ xấu theo bậc là 9%, 6%, 4%, 3%, nên cột trở nên có ích.`,

    prosCons: {
      pros: ['Giữ thứ bậc trong một cột.', 'Đưa được kiến thức nghiệp vụ vào mô hình.'],
      cons: ['Mô hình tuyến tính giả định các bậc cách đều.'],
    },

    whenToUse: {
      use: ['Biến có thứ bậc thật như mức độ, hạng thành viên, trình độ.'],
      avoid: ['Biến định danh trong mô hình tuyến tính, vì thứ tự là giả.', 'Khi các bậc rõ ràng cách không đều mà vẫn chỉ dùng một hệ số.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Ordinal Encoding', 'One-Hot'],
      rows: [
        ['Giữ thứ bậc', 'Có', 'Không'],
        ['Khoảng cách giữa các bậc', 'Giả định đều', 'Tự học'],
      ],
    },

    misconceptions: [
      {
        myth: 'Dùng `OrdinalEncoder` là dữ liệu tự có thứ tự đúng.',
        truth: 'Mặc định nó chỉ sắp theo giá trị. Thứ tự có ý nghĩa phải do người dùng khai báo.',
      },
      {
        myth: 'Mã số càng lớn thì tác động càng tăng đều.',
        truth: 'Đó là giả định của mô hình tuyến tính. Cần kiểm tra bằng tỷ lệ mục tiêu theo từng bậc.',
      },
    ],
  },
})
