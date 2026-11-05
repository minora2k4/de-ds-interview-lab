import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-data-mart',
  summary:
    'Data Mart là tập dữ liệu chuyên đề phục vụ một phòng ban hoặc một lĩnh vực. Mart dựng từ kho chung giữ được số liệu nhất quán, còn mart độc lập dễ trở thành silo.',
  tags: ['Kiến trúc lưu trữ', 'Data Mart', 'Inmon', 'Kimball'],
  related: ['dw-data-warehouse', 'dw-star-schema', 'dw-dimension-table', 'dw-medallion'],
  sections: {
    definition: `**Data Mart (Kho dữ liệu chuyên đề)** là tập dữ liệu thu hẹp theo một lĩnh vực, như tài chính hay marketing, được tổ chức sẵn cho nhóm dùng nó. Mart có thể là bảng vật lý riêng, hoặc chỉ là tập view trên [[dw-data-warehouse|kho]].`,

    origin: `Kho toàn doanh nghiệp có hàng nghìn bảng, rất khó tìm đúng thứ cần. Khi phải chờ đội trung tâm, các phòng ban tự dựng hệ thống riêng. Mart có kiểm soát đem lại sự đơn giản đó mà không mất nhất quán.`,

    whyUse: `Người dùng chỉ thấy phần liên quan với tên quen thuộc, nên dùng dễ hơn. Quyền truy cập cũng dễ quản lý theo từng nhóm.`,

    mechanism: `**Dependent (Phụ thuộc):** dựng từ kho chung, nên kế thừa định nghĩa và dữ liệu đã làm sạch. Đây là cách của Inmon.

**Independent (Độc lập):** lấy thẳng từ nguồn, không qua kho. Làm nhanh, nhưng mỗi mart có logic riêng, nên số liệu dần lệch nhau.

Với Kimball, mart là các [[dw-star-schema|Star Schema]] theo quy trình, dùng chung [[dw-dimension-table|Conformed Dimension]], nên so sánh chéo được. Nhờ tính toán và lưu trữ tách rời, nhiều nơi nay chỉ dùng view hoặc bảng trong lớp Gold.`,

    example: `Marketing tự lấy đơn hàng từ nguồn và tính doanh thu gồm cả đơn đã hủy, ra 52 tỷ đồng. Tài chính trừ đơn hủy và hoàn tiền, ra 47 tỷ đồng. Chuyển mart marketing sang dựng từ kho chung, dùng chung định nghĩa, thì sai lệch biến mất.`,

    prosCons: {
      pros: ['Đơn giản với người dùng và giới hạn đúng dữ liệu họ cần.'],
      cons: ['Mỗi bản sao vật lý là thêm một pipeline và thêm chi phí.', 'Mart độc lập làm các định nghĩa lệch nhau.'],
    },

    whenToUse: {
      use: ['Một nhóm có nhu cầu ổn định và cần giao diện dữ liệu đơn giản.', 'Cần tách quyền truy cập, như dữ liệu lương của nhân sự.'],
      avoid: ['Không tạo mart độc lập chỉ vì đội trung tâm chậm, hãy sửa quy trình.'],
    },

    comparison: {
      intro: 'So sánh Data Mart với kho toàn doanh nghiệp:',
      headers: ['Tiêu chí', 'Data Warehouse', 'Data Mart phụ thuộc', 'Data Mart độc lập'],
      rows: [
        ['Phạm vi', 'Toàn doanh nghiệp', 'Một lĩnh vực', 'Một lĩnh vực'],
        ['Nguồn dữ liệu', 'Nhiều hệ thống', 'Kho chung', 'Trực tiếp từ nguồn'],
        ['Nhất quán', 'Cao', 'Cao', 'Dễ lệch'],
        ['Tốc độ triển khai', 'Chậm', 'Trung bình', 'Nhanh'],
      ],
    },

    misconceptions: [
      {
        myth: 'Data Mart nhất định phải là một cơ sở dữ liệu riêng.',
        truth: 'Mart là khái niệm logic. Tập view hoặc schema riêng trên cùng kho vẫn là Data Mart, và thường rẻ hơn nhiều.',
      },
    ],
  },
})
