import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-transformation',
  summary:
    'Data Transformation biến dữ liệu thô thành dữ liệu sạch và đúng nghĩa nghiệp vụ, bằng cách làm sạch, chuẩn hóa, khử trùng lặp, nối và tổng hợp. Sai ở đây thường cho số liệu sai mà không báo lỗi.',
  tags: ['Transformation', 'dbt'],
  related: ['etl-etl-elt', 'etl-validation', 'etl-idempotency', 'dw-medallion', 'dw-fact-table', 'spark-sql'],
  sections: {
    definition: `**Data Transformation (Biến đổi dữ liệu)** là các phép xử lý đưa dữ liệu thô về dạng dùng được: làm sạch, chuẩn hóa, khử trùng lặp, nối bảng, tổng hợp và tính chỉ số nghiệp vụ.`,

    origin: `Trước đây logic biến đổi nằm rải rác trong script, khó kiểm thử và khó theo dõi phụ thuộc. dbt đưa cách làm của kỹ sư phần mềm vào đây: mô hình SQL có phiên bản, có test, và phụ thuộc khai báo qua \`ref\`.`,

    whyUse: `Nếu mỗi báo cáo tự tính doanh thu, các bộ phận sẽ có nhiều con số khác nhau. Một lớp dùng chung giúp mọi người có cùng số liệu.`,

    mechanism: `Thường chia theo lớp, như [[dw-medallion|Medallion]], để dễ khoanh vùng lỗi. Khi viết biến đổi cần giữ:

- **Grain (độ chi tiết):** một dòng biểu diễn cái gì. Nối với bảng có nhiều dòng cùng khóa sẽ nhân dòng, và tổng hợp sau đó bị thổi phồng.
- **Tính xác định:** cùng đầu vào ra cùng đầu ra. Tránh \`now()\` để [[etl-idempotency|chạy lại]] an toàn.
- **Ngữ cảnh lịch sử:** đổi tiền theo tỷ giá ngày giao dịch, không theo hôm nay.`,

    example: `Bảng \`orders\` có 10 triệu dòng, doanh thu 120 tỷ đồng. Một kỹ sư nối với \`payments\`. Do 8% đơn trả nhiều lần, kết quả có 10,8 triệu dòng và doanh thu thành 131 tỷ, mà không có lỗi nào. Sửa bằng cách tổng hợp \`payments\` về grain đơn hàng trước khi nối, và thêm test so tổng.`,

    prosCons: {
      pros: ['Một định nghĩa dùng chung cho mọi báo cáo.'],
      cons: ['Lỗi logic không làm dừng job, nên dễ lọt ra người dùng.'],
    },

    whenToUse: {
      use: ['SQL trong kho cho logic quan hệ như nối và tổng hợp.', '[[spark-overview|Spark]] khi logic phức tạp hoặc dữ liệu rất lớn.'],
      avoid: ['Không đặt logic nghiệp vụ trong công cụ BI.'],
    },

    comparison: {
      headers: ['Cách làm', 'Phù hợp khi', 'Đánh đổi'],
      rows: [
        ['SQL và dbt', 'Logic quan hệ, đội phân tích tham gia', 'Khó với logic phức tạp'],
        ['Spark', 'Dữ liệu rất lớn, bán cấu trúc', 'Vận hành và kỹ năng cao hơn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Job chạy thành công nghĩa là kết quả đúng.',
        truth: 'Nhân dòng do nối sai không gây lỗi nào. Cần [[etl-validation|kiểm tra]] khóa duy nhất và đối chiếu tổng.',
      },
    ],
  },
})
