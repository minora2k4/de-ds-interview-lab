import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-snowflake-schema',
  summary:
    'Snowflake Schema chuẩn hóa bảng chiều thành nhiều bảng theo phân cấp. Cách này giảm lặp nhưng thêm Join, và dung lượng tiết kiệm được trong kho cột thường rất nhỏ.',
  tags: ['Mô hình chiều', 'Chuẩn hóa', 'Đánh đổi'],
  related: ['dw-star-schema', 'dw-dimension-table', 'db-normalization', 'db-denormalization', 'dw-fact-table'],
  sections: {
    definition: `**Snowflake Schema (Lược đồ bông tuyết)** là biến thể của [[dw-star-schema]], trong đó các [[dw-dimension-table|Dimension Table]] được chuẩn hóa thành nhiều bảng theo phân cấp, ví dụ sản phẩm, rồi danh mục, rồi ngành hàng.`,

    origin: `Khi đĩa còn đắt và kho còn lưu theo hàng, tách phân cấp ra bảng riêng theo tư duy [[db-normalization|chuẩn hóa]] giúp tiết kiệm đáng kể. Kho cột và lưu trữ rẻ đã làm lợi ích đó nhỏ đi rất nhiều.`,

    whyUse: `Lợi ích chính là một phân cấp dùng chung được cập nhật ở đúng một nơi, có ích khi phân cấp lớn hoặc do một nhóm khác quản lý.`,

    mechanism: `Mỗi cấp trong phân cấp trở thành một bảng, nối với nhau bằng khóa. Fact chỉ nối tới bảng chiều gốc, nên muốn lọc theo ngành hàng phải đi qua thêm hai Join.

Kimball khuyên tránh snowflake vì hai lý do: người dùng khó hiểu và khó điều hướng, và truy vấn có thể chậm hơn. Bảng chiều phẳng chứa đúng cùng thông tin đó.

**Vì sao tiết kiệm ít:** phần lớn dung lượng nằm ở fact, và fact giống hệt nhau ở cả hai mô hình. Phần được tiết kiệm chỉ nằm trong chiều, mà chiều thì nhỏ và nén rất tốt.`,

    example: `\`dim_product\` có 200.000 dòng, cột \`brand\` dài 40 byte. Không nén, cột này tốn 8 MB. Tách \`dim_brand\` và thay bằng khóa 4 byte chỉ tiết kiệm khoảng 7 MB, so với fact 5 TB. Đổi lại, mọi báo cáo theo thương hiệu có thêm một Join.`,

    prosCons: {
      pros: ['Đổi tên một danh mục chỉ sửa một dòng.'],
      cons: ['Thêm Join nên truy vấn dài và khó viết đúng hơn.'],
    },

    whenToUse: {
      use: ['Phân cấp lớn, dùng chung cho nhiều chiều.', 'Lớp phục vụ có lớp ngữ nghĩa che được các Join khỏi người dùng.'],
      avoid: ['Không tách chỉ để tiết kiệm dung lượng trên kho cột.', 'Không dùng khi người dùng tự viết truy vấn trực tiếp.'],
    },

    comparison: {
      intro: 'So sánh với Star Schema trên kho dạng cột hiện đại:',
      headers: ['Tiêu chí', 'Star Schema', 'Snowflake Schema'],
      rows: [
        ['Cấu trúc chiều', 'Một bảng phẳng', 'Nhiều bảng phân cấp'],
        ['Dung lượng chiều', 'Lặp nhưng nén tốt', 'Nhỏ hơn một chút'],
        ['Đổi một thuộc tính phân cấp', 'Sửa nhiều dòng', 'Sửa một dòng'],
        ['Độ dễ dùng', 'Cao', 'Thấp hơn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Snowflake Schema là mô hình của sản phẩm Snowflake.',
        truth: 'Tên mô hình có trước và không liên quan đến công ty này.',
      },
      {
        myth: 'Snowflake Schema giúp giảm đáng kể chi phí lưu trữ.',
        truth: 'Mức tiết kiệm chỉ tính trên chiều, rất nhỏ so với fact.',
      },
    ],
  },
})
