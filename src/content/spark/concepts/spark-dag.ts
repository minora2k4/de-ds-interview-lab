import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-dag',
  summary:
    'DAG là đồ thị có hướng, không chu trình, biểu diễn các bước tính toán và phụ thuộc giữa chúng. Spark dùng DAG để chia Stage, lập lịch và khôi phục khi có lỗi.',
  tags: ['Mô hình thực thi', 'Lập lịch'],
  related: ['spark-stage', 'spark-task', 'spark-lazy-evaluation', 'spark-shuffle', 'spark-rdd', 'etl-orchestration'],
  sections: {
    definition: `**DAG (Directed Acyclic Graph, đồ thị có hướng không chu trình)** là cách Spark biểu diễn công việc: mỗi nút là một tập dữ liệu, mỗi cạnh là một phép tính.

- **Có hướng:** dữ liệu chỉ đi từ cha sang con.
- **Không chu trình:** không có bước nào phụ thuộc vào kết quả của chính nó.

Tính không chu trình đến từ tính bất biến: mỗi phép biến đổi luôn tạo ra tập dữ liệu mới, nên không thể quay ngược lại sửa dữ liệu cũ.`,

    origin: `MapReduce buộc mọi công việc vào khuôn hai pha **Map rồi Reduce**. Một pipeline nhiều bước phải nối nhiều job, mỗi job ghi kết quả ra HDFS, và hệ thống không biết job sau cần gì từ job trước.

DAG tổng quát hóa mô hình này thành chuỗi bước bất kỳ. Điều này cho phép chạy nhiều bước trong một ứng dụng, gộp các bước không cần shuffle, và chỉ ghi dữ liệu trung gian khi thật sự cần, trong khi vẫn giữ được khả năng khôi phục.`,

    whyUse: `Biểu diễn thành DAG mang lại ba khả năng:

1. **Tối ưu lập lịch.** Spark biết bước nào độc lập để chạy song song, và bước nào phải chờ.
2. **Gộp các bước.** Chuỗi [[spark-narrow-transformation]] nằm chung một [[spark-stage]], tránh ghi đĩa không cần thiết.
3. **Khôi phục chọn lọc.** Khi mất dữ liệu, Spark lần theo DAG để chỉ chạy lại phần cần thiết, không chạy lại toàn bộ job.

Với người viết code, DAG trên Spark UI là công cụ để đọc xem job thật sự làm gì: bao nhiêu lần shuffle, đọc dữ liệu từ đâu, có Stage nào được bỏ qua.`,

    mechanism: `Quá trình tạo và dùng DAG như sau:

1. **Dựng đồ thị.** Mỗi Transformation thêm một nút. Với DataFrame, kế hoạch vật lý cuối cùng được chuyển thành chuỗi RDD, chính là DAG được thực thi.
2. **Action kích hoạt.** **DAGScheduler** duyệt ngược từ kết quả cuối, tìm các **Shuffle Dependency** và cắt tại đó. Mỗi đoạn giữa hai vị trí cắt là một Stage.
3. **Chạy theo thứ tự phụ thuộc.** Stage chỉ được gửi đi khi mọi Stage cha đã xong. **TaskScheduler** nhận từng nhóm Task và gửi tới Executor.
4. **Xử lý lỗi.** Task lỗi được chạy lại. Nếu file shuffle bị mất (\`FetchFailedException\`), DAGScheduler gửi lại Stage cha.
5. **Bỏ qua Stage.** Nếu kết quả shuffle cần dùng vẫn còn trên đĩa, Stage tạo ra chúng được đánh dấu **skipped** trên Spark UI.

Với **AQE**, kế hoạch còn được điều chỉnh sau mỗi Stage dựa trên số liệu thực tế, nên DAG cuối cùng có thể khác với dự tính ban đầu.`,

    diagram: {
      mermaid: `flowchart TD
  subgraph S1["Stage 1"]
    A["Đọc orders"] --> B["filter"]
  end
  subgraph S2["Stage 2"]
    C["Đọc customers"] --> D["select"]
  end
  subgraph S3["Stage 3"]
    E["join"]
  end
  subgraph S4["Stage 4"]
    G["groupBy, agg"] --> H["write"]
  end
  B -->|"shuffle"| E
  D -->|"shuffle"| E
  E -->|"shuffle"| G`,
      caption:
        'DAG của một job Join rồi tổng hợp. Mỗi mũi tên shuffle là một ranh giới Stage. Stage 1 và 2 độc lập nên chạy song song được.',
    },

    example: `Một job chậm bất thường. Kỹ sư mở tab SQL trên Spark UI và thấy DAG có hai nhánh đọc cùng một bảng đầu vào 1 TB. Hóa ra code tạo DataFrame \`base\`, dùng nó cho hai nhánh rồi \`union\` kết quả, nên bảng bị đọc và xử lý hai lần.

Sau khi \`persist\` DataFrame \`base\`, DAG chỉ còn một nhánh đọc nguồn, nhánh còn lại đọc từ cache, và job giảm từ 90 phút còn 50 phút. Đọc code khó thấy điều này, còn DAG cho thấy ngay.`,

    prosCons: {
      pros: [
        '**Tổng quát hơn** hai pha Map và Reduce, biểu diễn được pipeline nhiều bước.',
        '**Cho phép tối ưu,** gộp các bước và chạy song song các nhánh độc lập.',
        '**Khôi phục theo phần** nhờ biết rõ phụ thuộc giữa các bước.',
        '**Dễ quan sát** trên Spark UI.',
      ],
      cons: [
        '**Không biểu diễn được vòng lặp.** Thuật toán lặp phải tạo ra nhiều bước trong DAG, có thể làm kế hoạch rất dài.',
        '**DAG quá lớn** làm Driver tốn nhiều bộ nhớ và thời gian lập kế hoạch.',
        '**Lỗi muộn có thể tốn kém** vì phải chạy lại các Stage trước nếu mất file shuffle.',
      ],
    },

    whenToUse: {
      use: [
        'Đọc DAG trên Spark UI mỗi khi tìm hiểu vì sao job chậm.',
        'Tìm các nhánh đọc lặp cùng một nguồn để đặt cache đúng chỗ.',
        'Đếm số shuffle trước khi bắt đầu tối ưu.',
      ],
      avoid: [
        'Không để DAG quá sâu do vòng lặp: dùng checkpoint để cắt lineage.',
        'Không nhầm DAG của Spark với DAG của công cụ điều phối như Airflow.',
      ],
    },

    comparison: {
      intro: 'Chữ DAG xuất hiện ở nhiều công cụ nhưng ở các tầng khác nhau:',
      headers: ['Tiêu chí', 'DAG của Spark', 'DAG của Airflow'],
      rows: [
        ['Nút là gì', 'Tập dữ liệu, phép tính nội bộ', 'Tác vụ độc lập, ví dụ một job Spark'],
        ['Mức độ', 'Bên trong một job', 'Giữa nhiều job và hệ thống'],
        ['Ai tạo ra', 'Spark tự sinh từ code', 'Người viết định nghĩa'],
        ['Dữ liệu đi qua cạnh', 'Có', 'Thường không, chỉ là thứ tự chạy'],
        ['Khi lỗi', 'Tự tính lại Partition hoặc Stage', 'Thử lại theo cấu hình của Task'],
      ],
    },

    misconceptions: [
      {
        myth: 'Mỗi Transformation tạo ra một Stage.',
        truth: 'Stage chỉ được cắt tại ranh giới shuffle. Hàng chục Narrow Transformation vẫn nằm chung một Stage.',
      },
      {
        myth: 'DAG giống với lineage.',
        truth: 'Hai khái niệm liên quan nhưng khác nhau. Lineage là chuỗi phụ thuộc của từng RDD. DAG thực thi được tạo từ lineage, với các Stage và thứ tự chạy.',
      },
      {
        myth: 'Stage skipped trên Spark UI có nghĩa là bị lỗi.',
        truth: 'Stage skipped là tin tốt: kết quả shuffle cần dùng vẫn còn nên Spark không phải tính lại.',
      },
    ],
  },
})
