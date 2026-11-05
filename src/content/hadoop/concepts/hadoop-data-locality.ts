import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-data-locality',
  summary:
    'Data Locality là việc chạy task trên máy hoặc rack đang giữ dữ liệu để giảm truyền qua mạng, theo thứ tự node-local, rack-local, off-switch. Đây là ưu tiên, không phải đảm bảo, và mất ý nghĩa khi dùng S3.',
  tags: ['Hiệu năng', 'Lập lịch', 'Data Locality'],
  related: ['hadoop-hdfs', 'hadoop-inputsplit', 'hadoop-block-replication', 'hadoop-yarn', 'spark-task', 'cloud-s3'],
  sections: {
    definition: `**Data Locality (Đưa tính toán đến gần dữ liệu)** là việc chạy task càng gần nơi có dữ liệu càng tốt, thay vì kéo dữ liệu về nơi tính toán. Có ba mức, từ tốt đến kém:

- **Node-local:** task chạy trên chính máy đang giữ block.
- **Rack-local:** task chạy trên máy khác trong cùng rack.
- **Off-switch:** task phải đọc dữ liệu từ rack khác.`,

    origin: `Với kho lưu trữ tập trung, mọi máy tính đều phải kéo dữ liệu qua mạng, và băng thông trở thành nút nghẽn. Thiết kế của [[hadoop-hdfs|HDFS]] dựa trên nhận xét rằng chuyển tính toán rẻ hơn nhiều so với chuyển dữ liệu: chương trình chỉ vài MB, còn dữ liệu lại hàng TB.`,

    whyUse: `Locality tốt giúp giảm tải mạng cho cả cụm, nhất là đường truyền giữa các rack, và tăng thông lượng khi nhiều task cùng đọc đĩa cục bộ. Đọc cục bộ còn có thể dùng **short-circuit read**, đọc thẳng từ đĩa mà không qua DataNode, nhưng mặc định tắt.`,

    mechanism: `1. InputFormat tạo các [[hadoop-inputsplit|InputSplit]], kèm danh sách máy đang giữ dữ liệu.
2. ApplicationMaster gửi yêu cầu Container cho [[hadoop-yarn|YARN]], kèm mong muốn về máy và rack.
3. Scheduler cố cấp đúng máy. Nếu máy đang bận, nó **chờ một lúc thay vì cấp ngay nơi khác**, gọi là **delay scheduling**. CapacityScheduler chờ theo số lần bỏ lỡ cơ hội cấp phát: \`node-locality-delay\` mặc định là **40**, sau đó mới chấp nhận rack-local.

**Đây là đánh đổi:** chờ lâu thì locality tốt nhưng tài nguyên bị bỏ trống. Không chờ thì task chạy ngay nhưng đọc qua mạng.

**Yếu tố làm giảm locality:** block có ít bản sao thì có ít máy phù hợp. Tệp lạnh chuyển sang Erasure Coding thì phần lớn thao tác đi qua rack khác. Trên S3, không có khái niệm locality nào cả.

Spark cũng làm tương tự, với các mức từ PROCESS_LOCAL tới ANY và thời gian chờ \`spark.locality.wait\`, xem [[spark-task]].`,

    example: `Một job có 1.000 Map task, mỗi task đọc 128 MB, tổng 125 GB. Khi đạt 95% node-local, chỉ khoảng 6 GB phải đi qua mạng. Nếu một hàng đợi quá đông làm tỷ lệ này tụt còn 40%, khoảng 75 GB phải qua mạng. Trong giờ cao điểm, đường truyền giữa các rack bị nghẽn, nên Map chậm hơn, dù CPU vẫn còn dư.`,

    prosCons: {
      pros: [
        'Giảm lượng dữ liệu đi qua mạng, nhất là giữa các rack.',
        'Tăng thông lượng khi cụm chạy nhiều job cùng lúc.',
      ],
      cons: [
        'Chờ cho đúng máy có thể làm tăng độ trễ khi bắt đầu task.',
      ],
    },

    whenToUse: {
      use: [
        'Theo dõi bộ đếm data-local trong job để phát hiện locality kém.',
        'Đặt `node-locality-delay` gần bằng số máy của cụm, theo gợi ý của tài liệu.',
      ],
      avoid: [
        'Không chờ locality quá lâu khi mạng nhanh và job cần bắt đầu sớm.',
        'Không cố tối ưu locality khi dữ liệu nằm trên S3, vì không có tác dụng.',
      ],
    },

    comparison: {
      intro: 'Ba mức locality khác nhau về đường đi của dữ liệu:',
      headers: ['Mức', 'Đường đi', 'Chi phí'],
      rows: [
        ['Node-local', 'Đọc đĩa cục bộ', 'Không tốn mạng'],
        ['Rack-local', 'Qua switch của rack', 'Tốn mạng trong rack'],
        ['Off-switch', 'Qua đường truyền giữa các rack', 'Đắt nhất, dễ nghẽn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Task luôn chạy trên máy chứa dữ liệu.',
        truth: 'Locality là ưu tiên, không phải đảm bảo. Nếu máy bận, Scheduler sẽ chọn rack-local hoặc off-switch sau một thời gian chờ.',
      },
      {
        myth: 'Locality luôn là yếu tố quan trọng nhất để job chạy nhanh.',
        truth: 'Với mạng tốc độ cao hiện nay, lợi ích giảm đi nhiều. Đó là một lý do khiến mô hình tách lưu trữ và tính toán trên đám mây trở nên phổ biến.',
      },
    ],
  },
})
