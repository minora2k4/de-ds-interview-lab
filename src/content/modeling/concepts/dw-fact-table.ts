import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-fact-table',
  summary:
    'Fact Table lưu số đo của một quy trình nghiệp vụ theo đúng một grain. Grain phải khai báo trước, vì mọi chiều và số đo đều phải khớp với nó.',
  tags: ['Mô hình chiều', 'Grain', 'First Principles'],
  related: ['dw-dimension-table', 'dw-star-schema', 'dw-data-modeling', 'dw-scd', 'dw-medallion'],
  sections: {
    definition: `**Fact Table (Bảng sự kiện)** lưu số đo của một quy trình nghiệp vụ, gồm khóa ngoại tới các [[dw-dimension-table|Dimension Table]] và các measure như số lượng, doanh thu. **Grain (Độ chi tiết)** là câu trả lời cho câu hỏi: một dòng trong bảng này đại diện cho điều gì.`,

    origin: `Trên schema giao dịch, số đo nằm rải rác ở nhiều bảng và nhiều mức chi tiết, nên cộng trực tiếp rất dễ tính trùng. Fact Table gom số đo của một quy trình về một bảng với một grain rõ ràng.`,

    whyUse: `Grain đúng quyết định báo cáo có đúng không, và có trả lời được câu hỏi chi tiết về sau không.`,

    mechanism: `**Vì sao chọn grain trước:** Kimball gọi grain là hợp đồng ràng buộc của thiết kế. Mỗi chiều phải có đúng một giá trị trên một dòng, mỗi số đo phải thuộc đúng mức đó. Chưa có grain thì chưa thể kiểm tra hai điều này.

**Mỗi grain là một bảng riêng,** không trộn nhiều grain, nếu không phép cộng sẽ sai. Nên bắt đầu từ **atomic grain**, mức thấp nhất mà quy trình ghi nhận, vì mức chi tiết có thể cộng lên nhưng không thể tách ngược lại.

**Tính cộng được:** additive cộng theo mọi chiều như doanh thu, semi-additive không cộng theo thời gian như số dư, non-additive như tỷ lệ phải tính lại từ tử số và mẫu số.`,

    example: `Đơn hàng có 3 dòng hàng và phí ship 30.000 đồng. Nếu chép phí ship vào cả 3 dòng, \`SUM\` cho ra 90.000 đồng, sai gấp ba. Cách đúng là phân bổ 10.000 đồng cho mỗi dòng, hoặc tạo fact riêng với grain đơn hàng.`,

    prosCons: {
      pros: ['Grain rõ giúp phép cộng an toàn và câu hỏi nghiệp vụ dễ kiểm chứng.'],
      cons: ['Atomic grain tạo bảng rất lớn, thường phải thêm bảng tổng hợp.', 'Đổi grain sau khi đã chạy thật gần như là xây lại bảng.'],
    },

    whenToUse: {
      use: ['Viết grain thành một câu trước khi vẽ bảng: một dòng cho mỗi dòng hàng của đơn.'],
      avoid: ['Không để dòng tổng và dòng chi tiết cùng nằm trong một bảng.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Transaction', 'Periodic Snapshot', 'Accumulating Snapshot'],
      rows: [
        ['Một dòng là', 'Một sự kiện', 'Một đối tượng trong một kỳ', 'Một vòng đời'],
        ['Có cập nhật dòng cũ', 'Không', 'Không', 'Có'],
        ['Ví dụ', 'Dòng hàng', 'Số dư cuối ngày', 'Đơn từ đặt đến giao'],
      ],
    },

    misconceptions: [
      {
        myth: 'Grain càng chi tiết thì mọi báo cáo càng nhanh.',
        truth: 'Grain chi tiết làm báo cáo linh hoạt, nhưng phải quét nhiều hơn. Bảng tổng hợp mới là cách tăng tốc.',
      },
    ],
  },
})
