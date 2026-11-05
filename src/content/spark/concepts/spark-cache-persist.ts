import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-cache-persist',
  summary:
    'cache và persist giữ lại kết quả trung gian để các Action sau không phải tính lại. Chúng được thực hiện trì hoãn, tốn bộ nhớ và chỉ có lợi khi dữ liệu được dùng lại.',
  tags: ['Cache', 'Bộ nhớ', 'Storage Level'],
  related: ['spark-lazy-evaluation', 'spark-action', 'spark-executor', 'spark-rdd', 'spark-performance'],
  sections: {
    definition: `**Cache** và **Persist** yêu cầu Spark giữ lại kết quả của một DataFrame hoặc RDD trên các Executor, để lần sử dụng sau không phải tính lại từ đầu.

\`cache()\` dùng mức lưu mặc định, còn \`persist(level)\` cho phép chọn **Storage Level**. Mức mặc định khác nhau: \`RDD.cache()\` là \`MEMORY_ONLY\`, còn \`DataFrame.cache()\` là \`MEMORY_AND_DISK\`.`,

    origin: `Do [[spark-lazy-evaluation]], mỗi Action sẽ tính lại từ đầu. Với thuật toán lặp và phân tích tương tác, việc này rất lãng phí. MapReduce không có cách dùng lại dữ liệu trong bộ nhớ giữa các job, phải ghi ra HDFS rồi đọc lại. Cache là cách Spark giữ lại kết quả trung gian theo yêu cầu, không cần ghi vào hệ thống lưu trữ bền vững.`,

    whyUse: `Khi một kết quả tốn kém được dùng từ hai lần trở lên, ví dụ pipeline tách nhánh hoặc thuật toán lặp, cache có thể giảm thời gian đáng kể và làm cho kết quả nhất quán giữa các nhánh trong cùng lần chạy. Spark cũng giữ lại lineage, nên phần cache bị mất vẫn có thể tính lại.`,

    mechanism: `Quy trình gồm các bước:

1. Gọi \`cache()\` chỉ đánh dấu, **chưa lưu gì cả**.
2. Action đầu tiên tính dữ liệu, đồng thời lưu từng Partition vào Executor.
3. Các Action sau đọc từ cache, thấy trong kế hoạch là \`InMemoryTableScan\`.
4. Gọi \`unpersist()\` để giải phóng khi không cần nữa.

**Các Storage Level chính:** \`MEMORY_ONLY\` (không vừa bộ nhớ thì tính lại), \`MEMORY_AND_DISK\` (không vừa thì đẩy xuống đĩa), \`DISK_ONLY\`, và các biến thể có hậu tố \`_2\` để giữ 2 bản sao. Spark đẩy các khối ít dùng ra theo LRU.

Lưu ý: khi đã cache, bộ lọc phía sau không được đẩy xuống nguồn nữa mà phải quét trên dữ liệu đã cache.`,

    example: `Một pipeline làm sạch 500 GB đơn hàng mất 40 phút, sau đó tách thành ba báo cáo khác nhau. Không cache, tổng thời gian là 120 phút do làm sạch ba lần. Sau khi \`persist(MEMORY_AND_DISK)\` DataFrame đã làm sạch, gọi \`count\` để nạp, rồi tạo các báo cáo, tổng thời gian còn khoảng 55 phút. Sau khi xong thì \`unpersist()\` để trả bộ nhớ cho phần còn lại của ứng dụng.`,

    prosCons: {
      pros: [
        'Tránh tính lại khi dữ liệu được dùng nhiều lần.',
        'Giữ được lineage nên vẫn khôi phục được.',
        'DataFrame cache ở dạng cột và nén, nên khá gọn.',
      ],
      cons: [
        'Chiếm bộ nhớ Executor, làm giảm phần cho shuffle và join.',
        'Dùng một lần thì chỉ tốn thêm chi phí.',
        'Dữ liệu có thể lệch thời điểm so với nguồn nếu nguồn thay đổi.',
      ],
    },

    whenToUse: {
      use: [
        'Một DataFrame tốn kém được dùng từ hai lần trở lên.',
        'Thuật toán lặp hoặc phân tích tương tác trên cùng một tập dữ liệu.',
        'Dùng `checkpoint` khi lineage quá dài hoặc cần kết quả bền vững hơn.',
      ],
      avoid: [
        'Dữ liệu chỉ dùng một lần.',
        'Dữ liệu quá lớn so với bộ nhớ khi mức lưu không hỗ trợ đĩa.',
        'Cache ngay sau khi đọc Parquet khi phía sau có bộ lọc mạnh: làm mất Predicate Pushdown.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'cache / persist', 'checkpoint', 'Ghi ra bảng'],
      rows: [
        ['Giữ lineage', 'Có', 'Không, lineage bị cắt', 'Không liên quan'],
        ['Nơi lưu', 'Bộ nhớ hoặc đĩa của Executor', 'Bộ nhớ bền vững như HDFS, S3', 'Hệ thống lưu trữ'],
        ['Sau khi ứng dụng kết thúc', 'Mất', 'Có thể giữ lại', 'Còn'],
        ['Mục đích chính', 'Tăng tốc dùng lại', 'Cắt lineage, chịu lỗi', 'Chia sẻ giữa các ứng dụng'],
      ],
    },

    misconceptions: [
      {
        myth: 'Gọi `cache()` là dữ liệu được lưu ngay.',
        truth: 'Nó cũng trì hoãn như Transformation. Dữ liệu chỉ được nạp khi có Action đầu tiên, và chỉ đủ các Partition mà Action đó tính tới.',
      },
      {
        myth: 'Cache càng nhiều thì job càng nhanh.',
        truth: 'Cache chiếm bộ nhớ của Execution, có thể gây thêm spill và GC. Với dữ liệu dùng một lần, cache làm job chậm đi.',
      },
    ],
  },
})
