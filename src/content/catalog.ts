import type {
  ConceptEntry,
  Domain,
  DomainId,
  QuizField,
  Subtopic,
  Tier,
  Topic,
} from '../domain/types'

type RawConcept = [id: string, title: string, viTitle: string | null, tier: Tier, overview?: true]

interface RawSubtopic {
  id: string
  title: string
  concepts: RawConcept[]
  shared?: string[]
}

function topic(
  id: string,
  title: string,
  description: string,
  domains: DomainId[],
  fields: QuizField[],
  subtopics: RawSubtopic[],
): Topic {
  return {
    id,
    title,
    description,
    domains,
    fields,
    subtopics: subtopics.map(
      (sub): Subtopic => ({
        id: sub.id,
        title: sub.title,
        sharedConceptIds: sub.shared,
        concepts: sub.concepts.map(
          ([conceptId, conceptTitle, viTitle, tier, overview]): ConceptEntry => ({
            id: conceptId,
            title: conceptTitle,
            viTitle: viTitle ?? undefined,
            tier,
            overview,
            topicId: id,
            subtopicId: sub.id,
          }),
        ),
      }),
    ),
  }
}

export const DOMAINS: Domain[] = [
  {
    id: 'de',
    title: 'Data Engineering',
    description:
      'Thiết kế, xây dựng và vận hành hệ thống dữ liệu: từ Database, Data Warehouse đến Spark, Kafka và kiến trúc pipeline.',
  },
  {
    id: 'ds',
    title: 'Data Science',
    description:
      'Nền tảng thống kê, phân tích dữ liệu, Feature Engineering và cách đánh giá mô hình một cách có căn cứ.',
  },
]

export const TOPICS: Topic[] = [
  topic(
    'database',
    'Database',
    'Chuẩn hóa, giao dịch, phân vùng và tối ưu truy vấn: nền móng của mọi hệ thống dữ liệu.',
    ['de'],
    ['de'],
    [
      {
        id: 'db-design',
        title: 'Thiết kế lược đồ',
        concepts: [
          ['db-normalization', 'Database Normalization', 'Chuẩn hóa cơ sở dữ liệu', 'A'],
          ['db-denormalization', 'Denormalization', 'Phi chuẩn hóa', 'B'],
        ],
      },
      {
        id: 'db-consistency',
        title: 'Giao dịch và tính nhất quán',
        concepts: [
          ['db-acid', 'ACID', 'Bốn tính chất của giao dịch', 'A'],
          ['db-transactions', 'Transactions', 'Giao dịch', 'B'],
          ['db-isolation-levels', 'Isolation Levels', 'Các mức cô lập', 'A'],
        ],
      },
      {
        id: 'db-systems',
        title: 'Phân loại hệ thống',
        concepts: [
          ['db-oltp-olap', 'OLTP và OLAP', 'Xử lý giao dịch và xử lý phân tích', 'A'],
          ['db-relational-nosql', 'Relational Database và NoSQL', 'CSDL quan hệ và phi quan hệ', 'B'],
        ],
      },
      {
        id: 'db-scaling',
        title: 'Mở rộng và tối ưu',
        concepts: [
          ['db-partitioning', 'Partitioning', 'Phân vùng dữ liệu', 'B'],
          ['db-sharding', 'Sharding', 'Phân mảnh ngang giữa nhiều máy chủ', 'A'],
          ['db-query-optimization', 'Query Optimization', 'Tối ưu truy vấn', 'A'],
          ['db-execution-plan', 'Execution Plan', 'Kế hoạch thực thi', 'B'],
        ],
      },
    ],
  ),
  topic(
    'modeling',
    'Data Modeling và Data Warehouse',
    'Cách tổ chức dữ liệu phân tích: mô hình chiều, Data Warehouse, Data Lake và Lakehouse.',
    ['de'],
    ['de'],
    [
      {
        id: 'dw-modeling',
        title: 'Mô hình hóa dữ liệu',
        concepts: [
          ['dw-data-modeling', 'Data Modeling', 'Mô hình hóa dữ liệu', 'B'],
          ['dw-fact-table', 'Fact Table', 'Bảng sự kiện', 'B'],
          ['dw-dimension-table', 'Dimension Table', 'Bảng chiều', 'B'],
          ['dw-star-schema', 'Star Schema', 'Lược đồ hình sao', 'A'],
          ['dw-snowflake-schema', 'Snowflake Schema', 'Lược đồ bông tuyết', 'B'],
          ['dw-scd', 'Slowly Changing Dimensions (SCD)', 'Chiều thay đổi chậm', 'A'],
          ['dw-schema-evolution', 'Schema Evolution', 'Tiến hóa lược đồ', 'B'],
        ],
      },
      {
        id: 'dw-storage',
        title: 'Kiến trúc lưu trữ',
        concepts: [
          ['dw-data-warehouse', 'Data Warehouse', 'Kho dữ liệu', 'A'],
          ['dw-data-mart', 'Data Mart', 'Kho dữ liệu chuyên đề', 'B'],
          ['dw-data-lake', 'Data Lake', 'Hồ dữ liệu', 'B'],
          ['dw-data-lakehouse', 'Data Lakehouse', 'Kết hợp Data Lake và Data Warehouse', 'A'],
          ['dw-medallion', 'Medallion Architecture', 'Kiến trúc Bronze, Silver, Gold', 'A'],
        ],
      },
    ],
  ),
  topic(
    'etl',
    'ETL / ELT và Data Pipeline',
    'Đưa dữ liệu từ nguồn đến nơi dùng một cách đáng tin cậy, lặp lại được và kiểm soát được chất lượng.',
    ['de'],
    ['de'],
    [
      {
        id: 'etl-processing',
        title: 'Mô hình xử lý',
        concepts: [
          ['etl-etl-elt', 'ETL và ELT', 'Thứ tự trích xuất, biến đổi và nạp', 'A'],
          ['etl-batch', 'Batch Processing', 'Xử lý theo lô', 'B'],
          ['etl-stream', 'Stream Processing', 'Xử lý luồng', 'A'],
        ],
      },
      {
        id: 'etl-loading',
        title: 'Thu nhận và nạp dữ liệu',
        concepts: [
          ['etl-ingestion', 'Data Ingestion', 'Thu nhận dữ liệu', 'B'],
          ['etl-full-load', 'Full Loading', 'Nạp toàn bộ', 'B'],
          ['etl-incremental', 'Incremental Loading', 'Nạp tăng dần', 'A'],
          ['etl-cdc', 'Change Data Capture (CDC)', 'Bắt thay đổi dữ liệu', 'A'],
        ],
      },
      {
        id: 'etl-reliability',
        title: 'Biến đổi và độ tin cậy',
        concepts: [
          ['etl-transformation', 'Data Transformation', 'Biến đổi dữ liệu', 'B'],
          ['etl-validation', 'Data Validation', 'Kiểm tra hợp lệ dữ liệu', 'B'],
          ['etl-idempotency', 'Idempotency', 'Tính lũy đẳng', 'A'],
          ['etl-orchestration', 'Workflow Orchestration', 'Điều phối luồng công việc', 'B'],
        ],
      },
      {
        id: 'etl-governance-group',
        title: 'Chất lượng và quản trị',
        concepts: [
          ['etl-data-quality', 'Data Quality', 'Chất lượng dữ liệu', 'A'],
          ['etl-lineage', 'Data Lineage', 'Dòng dõi dữ liệu', 'B'],
          ['etl-governance', 'Data Governance', 'Quản trị dữ liệu', 'B'],
        ],
      },
    ],
  ),
  topic(
    'hadoop',
    'Apache Hadoop',
    'Hệ sinh thái mở đường cho Big Data: lưu trữ phân tán với HDFS, cấp phát tài nguyên với YARN, xử lý với MapReduce.',
    ['de'],
    ['de', 'bigdata'],
    [
      {
        id: 'hadoop-foundation',
        title: 'Nền tảng',
        concepts: [
          ['hadoop-overview', 'Apache Hadoop', 'Tổng quan hệ sinh thái Hadoop', 'A', true],
          ['hadoop-distributed-systems', 'Distributed Systems', 'Hệ thống phân tán', 'B'],
        ],
      },
      {
        id: 'hadoop-hdfs-group',
        title: 'HDFS',
        concepts: [
          ['hadoop-hdfs', 'HDFS', 'Hệ thống tệp phân tán của Hadoop', 'A'],
          ['hadoop-namenode', 'NameNode', 'Nút quản lý metadata', 'B'],
          ['hadoop-datanode', 'DataNode', 'Nút lưu dữ liệu', 'B'],
          ['hadoop-secondary-namenode', 'Secondary NameNode', 'Nút gộp checkpoint cho NameNode', 'B'],
          ['hadoop-block-replication', 'Block Replication', 'Sao chép khối dữ liệu', 'B'],
        ],
      },
      {
        id: 'hadoop-yarn-group',
        title: 'YARN',
        concepts: [
          ['hadoop-yarn', 'YARN', 'Bộ quản lý tài nguyên của Hadoop', 'A'],
          ['hadoop-resourcemanager', 'ResourceManager', 'Bộ quản lý tài nguyên toàn cụm', 'B'],
          ['hadoop-nodemanager', 'NodeManager', 'Tác nhân quản lý trên từng máy', 'B'],
        ],
      },
      {
        id: 'hadoop-mapreduce-group',
        title: 'MapReduce',
        concepts: [
          ['hadoop-mapreduce', 'MapReduce', 'Mô hình xử lý Map và Reduce', 'A'],
          ['hadoop-inputsplit', 'InputSplit', 'Phần dữ liệu đầu vào của một Map task', 'B'],
          ['hadoop-shuffle-sort', 'Shuffle and Sort', 'Xáo trộn và sắp xếp', 'B'],
        ],
      },
      {
        id: 'hadoop-reliability',
        title: 'Độ tin cậy và hiệu năng',
        concepts: [
          ['hadoop-fault-tolerance', 'Fault Tolerance', 'Khả năng chịu lỗi trong Hadoop', 'B'],
          ['hadoop-data-locality', 'Data Locality', 'Đưa tính toán đến gần dữ liệu', 'B'],
        ],
      },
    ],
  ),
  topic(
    'spark',
    'Apache Spark',
    'Engine xử lý dữ liệu phân tán phổ biến nhất: kiến trúc, mô hình thực thi, Shuffle, Join và tối ưu hiệu năng.',
    ['de'],
    ['de', 'bigdata'],
    [
      {
        id: 'spark-arch',
        title: 'Kiến trúc',
        concepts: [
          ['spark-overview', 'Apache Spark', 'Tổng quan Spark', 'A', true],
          ['spark-architecture', 'Spark Architecture', 'Kiến trúc Spark', 'A'],
          ['spark-driver', 'Driver', 'Tiến trình điều khiển', 'B'],
          ['spark-executor', 'Executor', 'Tiến trình thực thi', 'B'],
          ['spark-cluster-manager', 'Cluster Manager', 'Bộ quản lý cụm', 'B'],
        ],
      },
      {
        id: 'spark-api',
        title: 'API dữ liệu',
        concepts: [
          ['spark-rdd', 'RDD', 'Tập dữ liệu phân tán có khả năng phục hồi', 'B'],
          ['spark-dataframe', 'DataFrame', 'Bảng dữ liệu phân tán có schema', 'A'],
          ['spark-dataset', 'Dataset', 'API có kiểu tĩnh trên JVM', 'B'],
          ['spark-sql', 'Spark SQL', 'Mô-đun xử lý dữ liệu có cấu trúc', 'B'],
          ['spark-pyspark', 'PySpark', 'API Python của Spark', 'B'],
        ],
      },
      {
        id: 'spark-execution',
        title: 'Mô hình thực thi',
        concepts: [
          ['spark-lazy-evaluation', 'Lazy Evaluation', 'Đánh giá trì hoãn', 'A'],
          ['spark-transformation', 'Transformation', 'Phép biến đổi', 'B'],
          ['spark-action', 'Action', 'Phép kích hoạt tính toán', 'B'],
          ['spark-narrow-transformation', 'Narrow Transformation', 'Biến đổi hẹp', 'B'],
          ['spark-wide-transformation', 'Wide Transformation', 'Biến đổi rộng', 'B'],
          ['spark-dag', 'DAG', 'Đồ thị có hướng không chu trình', 'A'],
          ['spark-stage', 'Stage', 'Giai đoạn thực thi', 'B'],
          ['spark-task', 'Task', 'Đơn vị công việc nhỏ nhất', 'B'],
        ],
      },
      {
        id: 'spark-data',
        title: 'Shuffle và phân vùng',
        concepts: [
          ['spark-shuffle', 'Shuffle', 'Phân phối lại dữ liệu giữa các Executor', 'A'],
          ['spark-partition', 'Partition', 'Phân vùng dữ liệu trong Spark', 'A'],
          ['spark-repartition-coalesce', 'Repartition và Coalesce', 'Thay đổi số phân vùng', 'B'],
          ['spark-cache-persist', 'Cache và Persist', 'Lưu đệm kết quả trung gian', 'B'],
        ],
      },
      {
        id: 'spark-join',
        title: 'Join',
        concepts: [
          ['spark-broadcast-join', 'Broadcast Join', 'Join bằng cách phát bảng nhỏ', 'A'],
          ['spark-sort-merge-join', 'Sort Merge Join', 'Join bằng sắp xếp và trộn', 'B'],
        ],
      },
      {
        id: 'spark-engine',
        title: 'Bộ tối ưu và engine',
        concepts: [
          ['spark-catalyst', 'Catalyst Optimizer', 'Bộ tối ưu truy vấn của Spark', 'A'],
          ['spark-tungsten', 'Tungsten Engine', 'Engine tối ưu bộ nhớ và CPU', 'B'],
        ],
      },
      {
        id: 'spark-performance-group',
        title: 'Hiệu năng',
        concepts: [
          ['spark-data-skew', 'Data Skew', 'Lệch dữ liệu', 'A'],
          ['spark-small-files', 'Small Files Problem', 'Vấn đề nhiều tệp nhỏ', 'B'],
          ['spark-performance', 'Performance Optimization', 'Tối ưu hiệu năng', 'A'],
        ],
      },
    ],
  ),
  topic(
    'kafka',
    'Apache Kafka',
    'Nền tảng log phân tán cho dữ liệu sự kiện: Topic, Partition, Consumer Group và các bảo đảm giao nhận.',
    ['de'],
    ['de', 'bigdata'],
    [
      {
        id: 'kafka-basics',
        title: 'Thành phần cơ bản',
        concepts: [
          ['kafka-overview', 'Apache Kafka', 'Tổng quan Kafka', 'A', true],
          ['kafka-messaging', 'Distributed Messaging System', 'Hệ thống truyền thông điệp phân tán', 'B'],
          ['kafka-producer', 'Producer', 'Bên gửi thông điệp', 'B'],
          ['kafka-consumer', 'Consumer', 'Bên đọc thông điệp', 'B'],
          ['kafka-broker', 'Broker', 'Máy chủ Kafka', 'B'],
        ],
      },
      {
        id: 'kafka-storage',
        title: 'Lưu trữ log',
        concepts: [
          ['kafka-topic', 'Topic', 'Luồng thông điệp có tên', 'B'],
          ['kafka-partition', 'Partition', 'Phân vùng của Topic', 'A'],
          ['kafka-offset', 'Offset', 'Vị trí thông điệp trong Partition', 'B'],
          ['kafka-retention', 'Retention', 'Thời hạn giữ dữ liệu', 'B'],
        ],
      },
      {
        id: 'kafka-scale',
        title: 'Mở rộng và sao chép',
        concepts: [
          ['kafka-consumer-group', 'Consumer Group', 'Nhóm Consumer chia việc', 'A'],
          ['kafka-replication', 'Replication', 'Sao chép Partition', 'A'],
          ['kafka-leader-follower', 'Leader và Follower', 'Bản chính và bản sao', 'B'],
        ],
      },
      {
        id: 'kafka-semantics',
        title: 'Bảo đảm giao nhận',
        concepts: [
          ['kafka-ordering', 'Message Ordering', 'Thứ tự thông điệp', 'B'],
          ['kafka-delivery-semantics', 'Delivery Semantics', 'Ngữ nghĩa giao nhận', 'A'],
          ['kafka-at-most-once', 'At-most-once', 'Giao tối đa một lần', 'B'],
          ['kafka-at-least-once', 'At-least-once', 'Giao ít nhất một lần', 'B'],
          ['kafka-exactly-once', 'Exactly-once', 'Xử lý đúng một lần', 'A'],
        ],
      },
      {
        id: 'kafka-compare',
        title: 'So sánh',
        concepts: [
          ['kafka-vs-rabbitmq', 'Kafka và RabbitMQ', 'Log phân tán và message broker truyền thống', 'B'],
          ['kafka-vs-spark-streaming', 'Kafka và Spark Streaming', 'Vận chuyển dữ liệu và xử lý dữ liệu', 'B'],
        ],
      },
    ],
  ),
  topic(
    'cloud',
    'Cloud và Distributed Systems',
    'Nguyên lý hệ phân tán và các dịch vụ dữ liệu trên AWS, Azure, Google Cloud.',
    ['de'],
    ['de', 'bigdata'],
    [
      {
        id: 'cloud-compute',
        title: 'Tính toán và mở rộng',
        concepts: [
          ['cloud-distributed-computing', 'Distributed Computing', 'Tính toán phân tán', 'B'],
          ['cloud-scaling', 'Horizontal Scaling và Vertical Scaling', 'Mở rộng ngang và mở rộng dọc', 'A'],
          ['cloud-load-balancing', 'Load Balancing', 'Cân bằng tải', 'B'],
        ],
      },
      {
        id: 'cloud-reliability',
        title: 'Độ tin cậy',
        concepts: [
          ['cloud-fault-tolerance', 'Fault Tolerance', 'Khả năng chịu lỗi', 'B'],
          ['cloud-high-availability', 'High Availability', 'Tính sẵn sàng cao', 'B'],
          ['cloud-replication', 'Replication', 'Sao chép dữ liệu', 'B'],
        ],
      },
      {
        id: 'cloud-consistency-group',
        title: 'Tính nhất quán',
        concepts: [
          ['cloud-consistency', 'Consistency', 'Tính nhất quán', 'A'],
          ['cloud-cap', 'CAP Theorem', 'Định lý CAP', 'A'],
          ['cloud-eventual-consistency', 'Eventual Consistency', 'Nhất quán sau cùng', 'B'],
        ],
      },
      {
        id: 'cloud-services',
        title: 'Dịch vụ Cloud',
        concepts: [
          ['cloud-s3', 'AWS S3', 'Dịch vụ lưu trữ đối tượng', 'A'],
          ['cloud-ec2', 'AWS EC2', 'Dịch vụ máy chủ ảo', 'B'],
          ['cloud-glue', 'AWS Glue', 'Dịch vụ ETL serverless', 'B'],
          ['cloud-redshift', 'AWS Redshift', 'Data Warehouse trên AWS', 'B'],
          ['cloud-adf', 'Azure Data Factory', 'Dịch vụ tích hợp dữ liệu trên Azure', 'B'],
          ['cloud-bigquery', 'Google BigQuery', 'Data Warehouse serverless', 'B'],
        ],
      },
    ],
  ),
  topic(
    'architecture',
    'Data Engineering Architecture',
    'Các kiểu kiến trúc dữ liệu và cách thiết kế, giám sát một pipeline đáng tin cậy.',
    ['de'],
    ['de', 'bigdata'],
    [
      {
        id: 'arch-patterns',
        title: 'Kiểu kiến trúc',
        concepts: [
          ['arch-lambda', 'Lambda Architecture', 'Kiến trúc hai nhánh batch và streaming', 'A'],
          ['arch-kappa', 'Kappa Architecture', 'Kiến trúc chỉ dùng streaming', 'A'],
          ['arch-batch', 'Batch Architecture', 'Kiến trúc xử lý theo lô', 'B'],
          ['arch-streaming', 'Streaming Architecture', 'Kiến trúc xử lý luồng', 'B'],
          ['arch-lakehouse', 'Data Lakehouse Architecture', 'Kiến trúc Lakehouse', 'B'],
        ],
      },
      {
        id: 'arch-operations',
        title: 'Thiết kế và vận hành',
        concepts: [
          ['arch-pipeline-design', 'Data Pipeline Design', 'Thiết kế Data Pipeline', 'A'],
          ['arch-monitoring-logging', 'Monitoring và Logging', 'Giám sát và ghi log', 'B'],
          ['arch-reliability', 'Data Reliability', 'Độ tin cậy của dữ liệu', 'B'],
          ['arch-observability', 'Data Observability', 'Khả năng quan sát dữ liệu', 'A'],
        ],
      },
    ],
  ),
  topic(
    'statistics',
    'Toán học và thống kê',
    'Xác suất, phân phối và suy luận thống kê: nền tảng để đọc đúng dữ liệu và kết quả thí nghiệm.',
    ['ds'],
    ['ds'],
    [
      {
        id: 'stats-descriptive-group',
        title: 'Thống kê mô tả',
        concepts: [
          ['stats-descriptive', 'Descriptive Statistics', 'Thống kê mô tả', 'B'],
          ['stats-central-tendency', 'Mean, Median, Mode', 'Trung bình, trung vị, yếu vị', 'B'],
          ['stats-variance-std', 'Variance và Standard Deviation', 'Phương sai và độ lệch chuẩn', 'B'],
        ],
      },
      {
        id: 'stats-probability-group',
        title: 'Xác suất',
        concepts: [
          ['stats-probability', 'Probability', 'Xác suất', 'B'],
          ['stats-conditional', 'Conditional Probability', 'Xác suất có điều kiện', 'B'],
          ['stats-bayes', "Bayes' Theorem", 'Định lý Bayes', 'A'],
        ],
      },
      {
        id: 'stats-distributions-group',
        title: 'Phân phối xác suất',
        concepts: [
          ['stats-distributions', 'Probability Distributions', 'Phân phối xác suất', 'B'],
          ['stats-normal', 'Normal Distribution', 'Phân phối chuẩn', 'B'],
          ['stats-binomial', 'Binomial Distribution', 'Phân phối nhị thức', 'B'],
          ['stats-poisson', 'Poisson Distribution', 'Phân phối Poisson', 'B'],
        ],
      },
      {
        id: 'stats-inference',
        title: 'Suy luận thống kê',
        concepts: [
          ['stats-hypothesis', 'Hypothesis Testing', 'Kiểm định giả thuyết', 'A'],
          ['stats-p-value', 'P-value', 'Giá trị p', 'A'],
          ['stats-confidence-interval', 'Confidence Interval', 'Khoảng tin cậy', 'A'],
          ['stats-type-errors', 'Type I và Type II Errors', 'Sai lầm loại I và loại II', 'A'],
        ],
      },
      {
        id: 'stats-relationship',
        title: 'Mối quan hệ giữa các biến',
        concepts: [
          ['stats-correlation-causation', 'Correlation và Causation', 'Tương quan và nhân quả', 'A'],
          ['stats-covariance', 'Covariance', 'Hiệp phương sai', 'B'],
        ],
      },
    ],
  ),
  topic(
    'analysis',
    'Data Analysis',
    'Khám phá dữ liệu, phát hiện vấn đề như giá trị thiếu, ngoại lai, rò rỉ dữ liệu trước khi xây mô hình.',
    ['ds'],
    ['ds'],
    [
      {
        id: 'eda-explore',
        title: 'Khám phá dữ liệu',
        concepts: [
          ['eda-overview', 'Exploratory Data Analysis (EDA)', 'Phân tích khám phá dữ liệu', 'A'],
          ['eda-distribution', 'Data Distribution', 'Phân phối của dữ liệu', 'B'],
          ['eda-skew-kurtosis', 'Skewness và Kurtosis', 'Độ lệch và độ nhọn', 'B'],
          ['eda-correlation', 'Correlation Analysis', 'Phân tích tương quan', 'B'],
        ],
        shared: ['fe-selection'],
      },
      {
        id: 'eda-issues',
        title: 'Vấn đề thường gặp',
        concepts: [
          ['eda-missing-values', 'Missing Values', 'Giá trị thiếu', 'A'],
          ['eda-outliers', 'Outlier Detection', 'Phát hiện ngoại lai', 'B'],
          ['eda-leakage', 'Data Leakage', 'Rò rỉ dữ liệu', 'A'],
          ['eda-imbalanced', 'Imbalanced Data', 'Dữ liệu mất cân bằng', 'A'],
        ],
      },
      {
        id: 'eda-sampling-group',
        title: 'Lấy mẫu',
        concepts: [['eda-sampling', 'Sampling', 'Lấy mẫu', 'B']],
      },
    ],
  ),
  topic(
    'features',
    'Feature Engineering',
    'Biến dữ liệu thô thành đặc trưng có ích: mã hóa, co giãn, xử lý giá trị thiếu và chọn đặc trưng.',
    ['ds'],
    ['ds'],
    [
      {
        id: 'fe-encoding',
        title: 'Mã hóa biến phân loại',
        concepts: [
          ['fe-one-hot', 'One-Hot Encoding', 'Mã hóa một cột cho mỗi giá trị', 'A'],
          ['fe-label-encoding', 'Label Encoding', 'Mã hóa nhãn thành số', 'B'],
          ['fe-ordinal-encoding', 'Ordinal Encoding', 'Mã hóa theo thứ bậc', 'B'],
          ['fe-woe', 'Weight of Evidence (WoE)', 'Trọng số bằng chứng', 'A'],
          ['fe-iv', 'Information Value (IV)', 'Giá trị thông tin', 'A'],
        ],
      },
      {
        id: 'fe-scaling',
        title: 'Co giãn dữ liệu số',
        concepts: [
          ['fe-standardization', 'Standardization', 'Chuẩn hóa về trung bình 0, độ lệch chuẩn 1', 'A'],
          ['fe-normalization', 'Normalization', 'Đưa dữ liệu về cùng thang đo', 'B'],
          ['fe-minmax', 'Min-Max Scaling', 'Co giãn về khoảng cố định', 'B'],
          ['fe-robust', 'Robust Scaling', 'Co giãn bền với ngoại lai', 'B'],
        ],
      },
      {
        id: 'fe-transform',
        title: 'Xử lý giá trị',
        concepts: [
          ['fe-imputation', 'Imputation', 'Điền giá trị thiếu', 'B'],
          ['fe-binning', 'Binning', 'Chia khoảng giá trị', 'B'],
        ],
      },
      {
        id: 'fe-selection-group',
        title: 'Tạo và chọn đặc trưng',
        concepts: [
          ['fe-extraction', 'Feature Extraction', 'Trích xuất đặc trưng', 'B'],
          ['fe-selection', 'Feature Selection', 'Chọn đặc trưng', 'A'],
        ],
      },
    ],
  ),
  topic(
    'evaluation',
    'Model Evaluation',
    'Đánh giá mô hình đúng cách: chia dữ liệu, các chỉ số phân loại và hồi quy, Calibration và Feature Importance.',
    ['ds'],
    ['ds'],
    [
      {
        id: 'eval-split',
        title: 'Chia dữ liệu',
        concepts: [
          ['eval-train-val-test', 'Train / Validation / Test', 'Ba tập dữ liệu', 'B'],
          ['eval-cross-validation', 'Cross Validation', 'Kiểm định chéo', 'A'],
        ],
      },
      {
        id: 'eval-fit',
        title: 'Độ khớp của mô hình',
        concepts: [
          ['eval-overfitting', 'Overfitting', 'Quá khớp', 'B'],
          ['eval-underfitting', 'Underfitting', 'Chưa khớp', 'B'],
          ['eval-bias-variance', 'Bias-Variance Tradeoff', 'Đánh đổi giữa độ lệch và phương sai', 'A'],
        ],
      },
      {
        id: 'eval-classification',
        title: 'Chỉ số phân loại',
        concepts: [
          ['eval-confusion-matrix', 'Confusion Matrix', 'Ma trận nhầm lẫn', 'A'],
          ['eval-accuracy', 'Accuracy', 'Độ chính xác tổng thể', 'B'],
          ['eval-precision', 'Precision', 'Tỷ lệ dự đoán dương đúng', 'B'],
          ['eval-recall', 'Recall', 'Tỷ lệ bắt được ca dương', 'B'],
          ['eval-f1', 'F1-score', 'Trung bình điều hòa của Precision và Recall', 'B'],
          ['eval-roc-auc', 'ROC-AUC', 'Diện tích dưới đường ROC', 'A'],
          ['eval-pr-auc', 'PR-AUC', 'Diện tích dưới đường Precision-Recall', 'A'],
          ['eval-gini', 'Gini Coefficient', 'Hệ số Gini', 'B'],
          ['eval-log-loss', 'Log Loss', 'Hàm mất mát logarit', 'B'],
        ],
      },
      {
        id: 'eval-regression',
        title: 'Chỉ số hồi quy',
        concepts: [
          ['eval-rmse', 'RMSE', 'Căn bậc hai sai số bình phương trung bình', 'B'],
          ['eval-mae', 'MAE', 'Sai số tuyệt đối trung bình', 'B'],
        ],
      },
      {
        id: 'eval-explain',
        title: 'Diễn giải và độ tin cậy',
        concepts: [
          ['eval-feature-importance', 'Feature Importance', 'Mức độ quan trọng của đặc trưng', 'A'],
          ['eval-calibration', 'Model Calibration', 'Hiệu chỉnh xác suất của mô hình', 'A'],
        ],
      },
    ],
  ),
  topic(
    'dataset-evaluation',
    'Đánh giá bộ dữ liệu',
    'Thế nào là một bộ dữ liệu tốt, đánh giá qua chỉ số nào, khác nhau ra sao theo từng loại dữ liệu và làm thế nào khi dữ liệu rất lớn.',
    ['ds', 'de'],
    ['ds', 'de'],
    [
      {
        id: 'dq-foundation',
        title: 'Thế nào là dữ liệu tốt',
        concepts: [
          ['dq-overview', 'Thế nào là bộ dữ liệu tốt', 'Fitness for Purpose (Phù hợp với mục đích)', 'A', true],
          ['dq-dimensions', 'Data Quality Dimensions', 'Các chiều chất lượng dữ liệu', 'A'],
          ['dq-representativeness', 'Representativeness và Selection Bias', 'Tính đại diện và sai lệch chọn mẫu', 'A'],
          ['dq-label-quality', 'Label Quality', 'Chất lượng nhãn', 'B'],
          ['dq-profiling', 'Data Profiling', 'Lập hồ sơ dữ liệu', 'B'],
        ],
      },
      {
        id: 'dq-types',
        title: 'Theo loại dữ liệu',
        concepts: [
          ['dq-tabular', 'Dữ liệu dạng bảng', 'Tabular Data', 'A'],
          ['dq-time-series', 'Dữ liệu chuỗi thời gian', 'Time Series Data', 'A'],
          ['dq-text', 'Dữ liệu văn bản', 'Text Data', 'B'],
          ['dq-image-audio', 'Dữ liệu hình ảnh và âm thanh', 'Image and Audio Data', 'B'],
          ['dq-event-log', 'Dữ liệu log và sự kiện', 'Event and Log Data', 'B'],
          ['dq-semi-structured', 'Dữ liệu bán cấu trúc', 'Semi-structured Data', 'B'],
        ],
      },
      {
        id: 'dq-measures',
        title: 'Đánh giá qua gì',
        concepts: [
          ['dq-metrics', 'Data Quality Metrics và Scorecard', 'Chỉ số và bảng điểm chất lượng', 'A'],
          ['dq-distribution-comparison', 'So sánh phân phối: KS Test, Chi-square, PSI', 'Distribution Comparison', 'A'],
          ['dq-drift', 'Data Drift và Concept Drift', 'Trôi dữ liệu và trôi khái niệm', 'A'],
          ['dq-sufficiency', 'Đủ dữ liệu chưa: Learning Curve và Baseline Model', 'Data Sufficiency', 'B'],
          ['dq-datasheets', 'Datasheets for Datasets', 'Tài liệu mô tả bộ dữ liệu', 'B'],
        ],
      },
      {
        id: 'dq-scale',
        title: 'Khi dữ liệu lớn',
        concepts: [
          ['dq-scale-strategy', 'Chiến lược đánh giá ở quy mô lớn', 'Data Quality at Scale', 'A'],
          ['dq-approximate', 'Thuật toán xấp xỉ: HyperLogLog, Count-Min Sketch, t-digest', 'Approximate Algorithms', 'A'],
          ['dq-sampling', 'Đánh giá bằng lấy mẫu', 'Sampling-based Assessment', 'B'],
          ['dq-incremental', 'Kiểm tra tăng dần theo Partition', 'Incremental Validation', 'B'],
          ['dq-streaming', 'Streaming Data Quality', 'Chất lượng dữ liệu luồng', 'B'],
          ['dq-tools', 'Công cụ: Deequ, Great Expectations, Soda, dbt tests', 'Data Quality Tools', 'B'],
        ],
      },
    ],
  ),
]

export const ALL_CONCEPTS: ConceptEntry[] = TOPICS.flatMap((t) =>
  t.subtopics.flatMap((s) => s.concepts),
)

const conceptById = new Map(ALL_CONCEPTS.map((c) => [c.id, c]))
const topicById = new Map(TOPICS.map((t) => [t.id, t]))

export function getConceptEntry(id: string): ConceptEntry | undefined {
  return conceptById.get(id)
}

export function getTopic(id: string): Topic | undefined {
  return topicById.get(id)
}

export function getSubtopicTitle(topicId: string, subtopicId: string): string {
  return getTopic(topicId)?.subtopics.find((s) => s.id === subtopicId)?.title ?? subtopicId
}

export function getDomain(id: DomainId): Domain {
  return DOMAINS.find((d) => d.id === id)!
}

export function topicsOfDomain(domain: DomainId): Topic[] {
  return TOPICS.filter((t) => t.domains.includes(domain))
}

export function conceptCount(topic: Topic): number {
  return topic.subtopics.reduce((sum, s) => sum + s.concepts.length, 0)
}

/** Đường dẫn trang khái niệm, mặc định dùng lĩnh vực đầu tiên của chủ đề. */
export function conceptPath(conceptId: string, domain?: DomainId): string {
  const entry = getConceptEntry(conceptId)
  if (!entry) return '/'
  const owner = getTopic(entry.topicId)!
  const useDomain = domain && owner.domains.includes(domain) ? domain : owner.domains[0]
  return `/${useDomain}/${owner.id}/${entry.id}`
}

export function topicPath(topicId: string, domain?: DomainId): string {
  const owner = getTopic(topicId)
  if (!owner) return '/'
  const useDomain = domain && owner.domains.includes(domain) ? domain : owner.domains[0]
  return `/${useDomain}/${owner.id}`
}
