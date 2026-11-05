import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-datasheets',
  summary:
    'Datasheets for Datasets là tài liệu đi kèm bộ dữ liệu, do Gebru và cộng sự đề xuất, ghi mục đích, thành phần, cách thu thập, cách dùng và giới hạn. Nó ghi lại những điều mà không thể tính ra từ chính dữ liệu.',
  tags: ['Tài liệu', 'Governance', 'Tuân thủ'],
  related: ['dq-overview', 'dq-representativeness', 'etl-lineage', 'etl-governance', 'dq-label-quality'],
  sections: {
    definition: `**Datasheets for Datasets (Tài liệu mô tả bộ dữ liệu)** là một bộ câu hỏi chuẩn mà người tạo bộ dữ liệu trả lời, để người dùng biết bộ dữ liệu được tạo ra thế nào và phù hợp với việc gì. Đề xuất này của Gebru và cộng sự, công bố năm 2018 và đăng trên Communications of the ACM năm 2021.`,

    origin: `Trong ngành điện tử, mỗi linh kiện đều có datasheet ghi điều kiện hoạt động. Dữ liệu dùng cho học máy lại thường không có gì tương tự, nên người ta dùng lại bộ dữ liệu cho các việc không phù hợp mà không biết. Datasheet lấy ý tưởng từ phần cứng để khắc phục khoảng trống này.`,

    whyUse: `Những câu hỏi quan trọng nhất về [[dq-representativeness|tính đại diện]] và giấy phép **không thể trả lời bằng cách xem dữ liệu**: ai bị loại khi thu thập, ai đồng ý cho dùng, nhãn được gán thế nào. Người biết rõ nhất là người tạo ra dữ liệu, nên phải ghi lại khi họ còn nhớ.`,

    mechanism: `Datasheet gồm các nhóm câu hỏi:

1. **Motivation:** vì sao tạo bộ dữ liệu, ai tài trợ.
2. **Composition:** mỗi dòng là gì, bao nhiêu dòng, có dữ liệu nhạy cảm không, có phải mẫu của một tổng thể lớn hơn không.
3. **Collection Process:** thu thập thế nào, trong thời gian nào, có sự đồng ý không.
4. **Preprocessing, Cleaning, Labeling:** đã làm gì với dữ liệu, có giữ lại dữ liệu thô không.
5. **Uses:** đã dùng cho việc gì, **không nên dùng cho việc gì**.
6. **Distribution:** phân phối thế nào, giấy phép gì.
7. **Maintenance:** ai duy trì, cập nhật ra sao.

Bài báo gốc cũng nói datasheet không nhằm thay thế việc theo dõi nguồn gốc và phiên bản, nên [[etl-lineage|lineage]] vẫn cần có riêng. Giá trị lớn nhất nằm ở phần "không nên dùng" và "giới hạn".`,

    example: `Đội phân tích định dùng một bộ dữ liệu giọng nói nội bộ để xây sản phẩm toàn quốc. Datasheet ghi: thu năm 2022, 90% người nói từ miền Bắc, chưa có sự đồng ý cho mục đích thương mại, không nên dùng để nhận diện danh tính. Chỉ mất 5 phút đọc, đội biết phải thu thêm giọng miền khác và xin lại sự đồng ý, trước khi tốn nhiều tuần huấn luyện.`,

    prosCons: {
      pros: ['Ghi lại những thông tin không thể suy ra từ dữ liệu.', 'Buộc người tạo suy nghĩ về giới hạn và rủi ro.'],
      cons: ['Tốn công viết, không tự động được.', 'Dễ lỗi thời nếu không có người duy trì khi dữ liệu đổi.'],
    },

    whenToUse: {
      use: ['Khi bộ dữ liệu được chia sẻ giữa các đội hoặc công bố ra ngoài.', 'Khi dữ liệu liên quan đến con người hoặc dùng cho quyết định rủi ro cao.'],
      avoid: ['Không viết đầy đủ cho mọi bảng trung gian trong pipeline.', 'Không xem datasheet là bằng chứng chất lượng: nó chỉ mô tả, không đảm bảo.'],
    },

    comparison: {
      headers: ['Tài liệu', 'Trả lời câu hỏi', 'Tự động được không'],
      rows: [
        ['Datasheet', 'Tạo ra thế nào, nên và không nên dùng vào việc gì', 'Phần lớn không'],
        ['Data Catalog', 'Có bảng nào, ở đâu, ai sở hữu', 'Phần lớn được'],
        ['[[etl-lineage|Lineage]]', 'Dữ liệu từ đâu đến, đi đâu', 'Phần lớn được'],
        ['[[dq-profiling|Data Profile]]', 'Dữ liệu hiện trông thế nào', 'Được'],
      ],
    },

    misconceptions: [
      { myth: 'Datasheet là phần mô tả các cột.', truth: 'Từ điển dữ liệu chỉ là một phần nhỏ. Datasheet tập trung vào mục đích, quy trình thu thập và giới hạn sử dụng.' },
      { myth: 'Có datasheet nghĩa là dữ liệu tốt.', truth: 'Datasheet giúp người dùng tự đánh giá mức phù hợp. Một datasheet trung thực có thể cho biết chính xác vì sao không nên dùng dữ liệu đó.' },
    ],
  },
})
