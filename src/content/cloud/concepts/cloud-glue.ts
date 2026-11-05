import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-glue',
  summary:
    'Glue là dịch vụ tích hợp dữ liệu serverless, gồm Data Catalog, Crawler và ETL job trên Spark. Job Bookmark giúp xử lý tăng dần, nhưng chỉ theo dõi nguồn và không phải exactly-once.',
  tags: ['AWS', 'ETL', 'Serverless', 'Data Catalog'],
  related: ['etl-etl-elt', 'etl-incremental', 'etl-idempotency', 'cloud-s3', 'cloud-redshift', 'spark-overview', 'cloud-adf'],
  sections: {
    definition: `**AWS Glue (Dịch vụ ETL serverless)** gồm ba phần chính: **Data Catalog** (kho metadata), **Crawler** (tự suy schema từ dữ liệu) và **ETL Job** (chạy Spark hoặc Python shell mà không phải quản lý cụm).`,

    origin: `Trước đó, muốn chạy ETL trên AWS phải dựng cụm EMR và tự vận hành Hive Metastore. Nhiều job chỉ chạy vài chục phút mỗi ngày nhưng vẫn phải lo cụm. Glue bỏ phần vận hành này và tính tiền theo thời gian chạy.`,

    whyUse: `Không có cụm phải vá lỗi hay canh tắt. Catalog dùng chung cho Athena, Redshift Spectrum và EMR, nên một bảng chỉ cần khai báo một lần.`,

    mechanism: `**DPU:** đơn vị năng lực, gồm 4 vCPU và 16 GB bộ nhớ. Worker \`G.1X\` là 1 DPU, \`G.2X\` là 2 DPU. Job được tính theo giây dựa trên số DPU.

**Crawler:** đọc mẫu dữ liệu, phân loại định dạng, gom thành bảng hoặc partition rồi ghi vào Catalog.

**Job Bookmark:** lưu trạng thái giữa các lần chạy để không đọc lại dữ liệu cũ. Hỗ trợ JDBC và một số nguồn S3.

- Cần bật tham số, gọi \`job.init\` và \`job.commit\`, và đặt \`transformation_ctx\`. Thiếu thì bookmark không hoạt động.
- Với S3, nó dựa vào thời gian sửa tệp, nên tệp bị sửa sẽ được đọc lại.
- Nó **chỉ theo dõi nguồn.** Quay lại bookmark không dọn dữ liệu đã ghi ở đích, nên phần ghi vẫn phải [[etl-idempotency|idempotent]].

**Flex:** dành cho việc không gấp như kiểm thử hay nạp một lần, chỉ với \`G.1X\` và \`G.2X\`. Việc cần chạy đúng giờ thì dùng lớp standard.

**Ray** đã đóng với khách hàng mới từ 30/4/2026.`,

    example: `Mỗi giờ có 40 GB JSON mới trên [[cloud-s3|S3]]. Job Glue dùng 10 \`G.1X\` và bookmark để chỉ đọc tệp mới, chuyển sang Parquet và chạy trong 6 phút. Bên trong vẫn là Spark, nên khi gặp skew, nhóm vẫn phải đọc Spark UI và sửa như thường.`,

    prosCons: {
      pros: ['Không vận hành cụm, tính tiền theo thời gian chạy.', 'Catalog tích hợp sẵn với nhiều dịch vụ AWS.'],
      cons: ['Ít quyền kiểm soát hơn EMR về cấu hình và phiên bản.', 'Job chạy dài và đều có thể đắt hơn cụm tự quản.'],
    },

    whenToUse: {
      use: ['ETL theo lô vừa và nhỏ, chạy không liên tục, nhóm ít người vận hành.'],
      avoid: ['Cần tinh chỉnh sâu hoặc chạy cụm liên tục ở quy mô lớn: xét EMR.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Glue', 'EMR', 'Lambda'],
      rows: [
        ['Quản lý cụm', 'Không', 'Có, trừ EMR Serverless', 'Không'],
        ['Phù hợp', 'ETL Spark theo lô', 'Spark, Hadoop lớn', 'Việc nhỏ theo sự kiện'],
        ['Kiểm soát', 'Vừa', 'Cao', 'Thấp'],
      ],
    },

    misconceptions: [
      {
        myth: 'Bật Job Bookmark là có exactly-once.',
        truth: 'Bookmark giúp tránh đọc lại nguồn, không kiểm soát đích. Job lỗi rồi chạy lại vẫn có thể ghi trùng.',
      },
      {
        myth: 'Serverless thì không cần hiểu Spark.',
        truth: 'Skew, tệp nhỏ và OOM vẫn xảy ra như Spark thường.',
      },
    ],
  },
})
