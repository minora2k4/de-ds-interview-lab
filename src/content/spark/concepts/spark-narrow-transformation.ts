import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-narrow-transformation',
  summary:
    'Trong Narrow Transformation, mỗi Partition cha chỉ đi vào tối đa một Partition con, nên không cần shuffle và được gộp chạy chung trong một Stage.',
  tags: ['Mô hình thực thi', 'Dependency'],
  related: ['spark-wide-transformation', 'spark-stage', 'spark-shuffle', 'spark-transformation', 'spark-dag'],
  sections: {
    definition: `**Narrow Transformation (Biến đổi hẹp)** là phép biến đổi mà **mỗi Partition của tập cha chỉ đóng góp vào tối đa một Partition của tập con**. Ví dụ: \`filter\`, \`select\`, \`map\`, \`withColumn\`, \`union\`, và cả \`coalesce\` khi không shuffle.

Điểm cốt lõi: một Partition con có thể tính được mà **không cần dữ liệu từ máy khác**, nên không phải [[spark-shuffle]].`,

    origin: `MapReduce chỉ có hai pha cố định, nên mỗi lần muốn nối thêm bước lại phải tạo job mới, tốn nhiều lần đọc ghi đĩa. Khi đưa ra khái niệm dependency, nhóm thiết kế Spark nhận ra các bước không cần trao đổi dữ liệu thì có thể chạy liền nhau trên từng Partition, không cần một ranh giới nào ở giữa.`,

    whyUse: `Hiểu Narrow Transformation giúp bạn thấy phần nào của pipeline rẻ. Các phép này được **gộp thành một chuỗi (Pipelining)** trong cùng [[spark-stage]]: mỗi bản ghi đi thẳng qua cả chuỗi mà không phải dừng lại ghi kết quả trung gian. Thêm một \`filter\` gần như không tốn thêm chi phí phối hợp.`,

    mechanism: `Mỗi [[spark-task]] đọc một Partition và áp dụng lần lượt các hàm trong chuỗi. Khi mất dữ liệu, chỉ cần tính lại đúng các Partition cha tương ứng trên một vài máy, nên việc khôi phục rất rẻ.

\`coalesce\` là trường hợp thú vị: Partition con gom từ nhiều Partition cha, nhưng mỗi Partition cha chỉ đi vào một con, nên vẫn là Narrow. Định nghĩa này quan tâm đến **chiều từ cha sang con**.`,

    example: `Một pipeline thực hiện liên tiếp: đọc Parquet, lọc đơn hàng hợp lệ, chọn 5 cột, thêm cột tiền đã quy đổi. Spark UI cho thấy tất cả chỉ gói trong một Stage duy nhất, với 800 Task. Mỗi Task làm trọn cả chuỗi cho một Partition, không có dữ liệu nào qua mạng. Chỉ đến \`groupBy\` phía sau, Stage mới được cắt.`,

    prosCons: {
      pros: [
        'Không tốn mạng và đĩa cho shuffle.',
        'Chạy liền nhau trong một Stage nên rất nhanh.',
        'Khôi phục rẻ vì chỉ cần tính lại ít Partition.',
      ],
      cons: [
        'Không gom được dữ liệu cùng key từ nhiều Partition.',
        'Không tự sửa được tình trạng dữ liệu phân bố không đều giữa các Partition.',
      ],
    },

    whenToUse: {
      use: [
        'Lọc và chọn cột càng sớm càng tốt để giảm dữ liệu trước phép Wide.',
        'Tính cột mới có thể suy ra từ chính dòng đó.',
      ],
      avoid: [
        'Không thể dùng khi cần nhóm hoặc nối theo key: phải dùng [[spark-wide-transformation]].',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Narrow', 'Wide'],
      rows: [
        ['Partition cha đi vào', 'Tối đa một Partition con', 'Nhiều Partition con'],
        ['Shuffle', 'Không', 'Có, trừ khi đã chia sẵn phù hợp'],
        ['Ranh giới Stage', 'Không tạo', 'Tạo ranh giới mới'],
        ['Khi mất dữ liệu', 'Tính lại ít', 'Có thể phải tính lại nhiều'],
        ['Ví dụ', '`filter`, `map`, `select`', '`groupBy`, `join`, `orderBy`'],
      ],
    },

    misconceptions: [
      {
        myth: 'Mọi phép giảm số Partition đều là Wide.',
        truth: '`coalesce` không shuffle là Narrow vì mỗi Partition cha chỉ đi vào một Partition con. `repartition` mới là Wide.',
      },
      {
        myth: 'Narrow có nghĩa là dữ liệu đầu ra ít hơn.',
        truth: 'Narrow nói về quan hệ giữa các Partition, không nói về số dòng. `flatMap` là Narrow nhưng có thể tăng số dòng.',
      },
    ],
  },
})
