import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-sampling',
  summary:
    'Đánh giá bằng lấy mẫu ước lượng tỷ lệ lỗi với chi phí nhỏ, và độ chính xác phụ thuộc vào cỡ mẫu chứ không phụ thuộc kích thước bảng. Phân tầng giúp không bỏ sót nhóm nhỏ, nhưng lấy mẫu vẫn yếu với lỗi hiếm và trùng lặp.',
  tags: ['Lấy mẫu', 'Phân tầng', 'Lỗi hiếm'],
  related: ['eda-sampling', 'dq-scale-strategy', 'dq-approximate', 'dq-dimensions', 'stats-confidence-interval'],
  sections: {
    definition: `**Sampling-based Assessment (Đánh giá bằng lấy mẫu)** là kiểm tra một phần dữ liệu để **ước lượng** chất lượng của toàn bộ. Lý thuyết về các kiểu lấy mẫu xem ở [[eda-sampling]], trang này nói về việc dùng mẫu để đánh giá.`,

    origin: `Có những kiểm tra không thể làm trên toàn bộ, vì mỗi dòng cần con người xem hoặc cần gọi một hệ thống khác, như đối chiếu với hóa đơn gốc. Lấy mẫu là cách duy nhất khả thi cho các kiểm tra đắt như vậy.`,

    whyUse: `Độ chính xác của ước lượng tỷ lệ **phụ thuộc vào cỡ mẫu, gần như không phụ thuộc vào kích thước bảng**. Mẫu 10.000 dòng cho sai số gần như nhau trên bảng 1 triệu hay 100 tỷ dòng, nên càng có lợi khi bảng càng lớn.`,

    mechanism: `**Sai số:** với tỷ lệ lỗi p và cỡ mẫu n, khoảng tin cậy 95% xấp xỉ \`p +/- 1,96 x căn(p(1-p)/n)\`.

**Quy tắc 3/n:** nếu không thấy lỗi nào trong n dòng, cận trên 95% của tỷ lệ lỗi vào khoảng 3/n. Không thấy lỗi không có nghĩa là không có lỗi.

**Phân tầng:** chia theo nguồn, ngày, đối tác rồi lấy mẫu trong từng nhóm, tỷ lệ cao hơn với nhóm nhỏ hoặc nhóm rủi ro. Nếu chỉ lấy ngẫu nhiên, đối tác chiếm 0,1% sẽ gần như không xuất hiện. Khi cộng kết quả, phải dùng trọng số theo tỷ lệ gốc.

**Điểm yếu với trùng lặp:** muốn thấy một cặp trùng, phải chọn trúng cả hai dòng, xác suất là p x p. Mẫu 1% chỉ giữ được 0,01% số cặp. Cách khắc phục là **lấy mẫu theo hash của khóa**: các dòng cùng khóa luôn được chọn cùng nhau, nên tính được tỷ lệ trùng.

**Lấy mẫu theo tệp hoặc row group** rẻ hơn nhiều vì đọc ít hơn, nhưng các dòng trong cùng tệp thường giống nhau, nên sai số thực tế cao hơn công thức.`,

    example: `Bảng 10 tỷ dòng, mẫu 1 triệu dòng không có lỗi định dạng nào. Theo quy tắc 3/n, tỷ lệ lỗi có thể tới 0,0003%, tức có thể vẫn còn khoảng 30.000 dòng lỗi. Như vậy đủ tốt cho báo cáo xu hướng, nhưng chưa đủ để kết luận "không có lỗi" cho dữ liệu tài chính. Với luật đó, đội chuyển sang quét đúng cột cần kiểm tra.`,

    prosCons: {
      pros: ['Là cách duy nhất cho kiểm tra cần con người hoặc nguồn bên ngoài.', 'Chi phí không tăng theo kích thước bảng.'],
      cons: ['Dễ bỏ sót lỗi hiếm và lỗi chỉ xảy ra trong một nhóm nhỏ.', 'Phép chọn ngẫu nhiên từng dòng rất yếu với kiểm tra trùng lặp và tham chiếu.'],
    },

    whenToUse: {
      use: ['Đo Accuracy bằng đối chiếu thủ công.', 'Ước lượng nhanh tỷ lệ lỗi trước khi quyết định có cần quét toàn bộ.'],
      avoid: ['Không dùng để chứng minh không có vi phạm.', 'Không lấy mẫu theo từng dòng để kiểm tra khóa trùng.'],
    },

    comparison: {
      headers: ['Cách lấy mẫu', 'Phù hợp với', 'Điểm yếu'],
      rows: [
        ['Ngẫu nhiên theo dòng', 'Ước lượng tỷ lệ lỗi chung', 'Nhóm nhỏ, cặp trùng'],
        ['Phân tầng', 'Nhóm nhỏ, nhóm rủi ro', 'Phải biết trước cách chia nhóm'],
        ['Theo hash của khóa', 'Trùng lặp, tham chiếu giữa bảng', 'Khóa lệch làm mẫu lệch'],
        ['Theo tệp, row group', 'Ước lượng nhanh, chi phí thấp', 'Dòng cùng tệp tương quan với nhau'],
      ],
    },

    misconceptions: [
      { myth: 'Bảng càng lớn thì mẫu càng phải lớn theo tỷ lệ.', truth: 'Khi bảng lớn hơn nhiều so với mẫu, sai số gần như chỉ phụ thuộc vào cỡ mẫu.' },
      { myth: 'Không thấy lỗi trong mẫu nghĩa là dữ liệu sạch.', truth: 'Quy tắc 3/n chỉ cho một cận trên của tỷ lệ lỗi. Mẫu càng nhỏ thì cận càng lỏng.' },
    ],
  },
})
