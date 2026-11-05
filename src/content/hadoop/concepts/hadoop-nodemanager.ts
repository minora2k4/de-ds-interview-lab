import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-nodemanager',
  summary:
    'NodeManager là tác nhân của YARN trên từng máy: khởi động Container, giám sát tài nguyên, báo cáo cho ResourceManager và giết Container dùng quá bộ nhớ được cấp.',
  tags: ['YARN', 'Container', 'Bộ nhớ'],
  related: ['hadoop-yarn', 'hadoop-resourcemanager', 'hadoop-datanode', 'spark-executor', 'hadoop-shuffle-sort'],
  sections: {
    definition: `**NodeManager (Tác nhân quản lý trên từng máy)** là tiến trình của [[hadoop-yarn|YARN]] chạy trên mỗi máy tính toán. Nó quản lý vòng đời của các **Container**, giám sát CPU, bộ nhớ, đĩa, mạng, và báo cáo cho [[hadoop-resourcemanager|ResourceManager]].`,

    origin: `Trong Hadoop 1, TaskTracker chạy trên từng máy với số ô Map và Reduce cố định, nên ô này rảnh cũng không cho ô kia dùng được. NodeManager chỉ biết tài nguyên, không biết gì về Map hay Reduce, nên chạy được Container của bất kỳ framework nào.`,

    whyUse: `Nhiều sự cố thực tế xảy ra ở lớp này, nhất là lỗi Container bị giết vì vượt bộ nhớ. Cấu hình sai dung lượng của NodeManager cũng có thể khiến phần lớn máy bị bỏ phí.`,

    mechanism: `**Khai báo dung lượng:** \`yarn.nodemanager.resource.memory-mb\` mặc định là -1. Nếu không bật tự dò phần cứng, giá trị thực là **8.192 MB**, dù máy có 256 GB RAM. Vì vậy phải cấu hình rõ, chừa lại phần cho hệ điều hành và DataNode.

**Khởi động Container:** khi ApplicationMaster yêu cầu, NodeManager tải các tệp cần thiết như JAR về máy, gọi là localization, rồi chạy tiến trình.

**Thực thi giới hạn:** nó định kỳ đo mức dùng bộ nhớ. Hai kiểm tra đều bật mặc định:

- **Bộ nhớ vật lý:** vượt mức được cấp là bị giết.
- **Bộ nhớ ảo:** vượt 2,1 lần mức được cấp là bị giết.

Vì sao phải giết: nếu không, một Container có thể làm cả máy hết RAM, ảnh hưởng đến mọi Container và cả DataNode trên máy đó.

**Dịch vụ phụ trợ:** NodeManager có thể chạy thêm các dịch vụ như \`mapreduce_shuffle\`, để phục vụ đầu ra của Map cho Reducer qua [[hadoop-shuffle-sort]]. Spark cũng có External Shuffle Service chạy theo cách này. Danh sách \`yarn.nodemanager.aux-services\` mặc định rỗng, nên phải tự khai báo.`,

    example: `Một [[spark-executor|Executor]] có heap 8 GB chạy UDF Python nặng. Heap vẫn còn trống, nhưng tiến trình Python làm tổng bộ nhớ vượt mức Container 9 GB, và NodeManager giết Container. Nhật ký báo vượt giới hạn bộ nhớ, trong khi không hề có lỗi Java heap. Tăng memory overhead lên 2 GB thì hết lỗi, còn tăng heap chỉ làm vấn đề nặng hơn nếu tổng Container không tăng theo.`,

    prosCons: {
      pros: [
        'Chạy được Container của mọi framework.',
        'Cô lập tài nguyên, tránh một ứng dụng làm hỏng cả máy.',
      ],
      cons: [
        'Giết Container do vượt bộ nhớ khá dễ gặp, và khó hiểu với người mới.',
        'Cấu hình dung lượng sai làm lãng phí máy hoặc gây quá tải.',
      ],
    },

    whenToUse: {
      use: [
        'Đặt dung lượng theo RAM thật của máy, trừ phần cho hệ điều hành và DataNode.',
        'Bật log aggregation để vẫn đọc được nhật ký sau khi Container đã kết thúc.',
      ],
      avoid: [
        'Không tắt kiểm tra bộ nhớ vật lý để né lỗi, vì máy có thể hết RAM.',
        'Không cấp toàn bộ RAM của máy cho Container.',
      ],
    },

    comparison: {
      intro: 'NodeManager và DataNode thường chạy trên cùng máy nhưng độc lập với nhau:',
      headers: ['Tiêu chí', 'NodeManager', 'DataNode'],
      rows: [
        ['Thuộc về', 'YARN', 'HDFS'],
        ['Quản lý', 'Container', 'Block'],
        ['Báo cáo cho', 'ResourceManager', 'NameNode'],
        ['Khi tiến trình chết', 'Mất Container đang chạy', 'Mất một nơi đọc block, còn bản sao'],
      ],
    },

    misconceptions: [
      {
        myth: 'NodeManager tự quyết định ứng dụng nào được chạy.',
        truth: 'Quyết định thuộc về Scheduler của ResourceManager. NodeManager chỉ thực hiện, khi ApplicationMaster đưa đúng thông tin Container đã được cấp.',
      },
      {
        myth: 'Container bị giết vì bộ nhớ nghĩa là heap bị đầy.',
        truth: 'NodeManager đo tổng bộ nhớ của tiến trình, gồm cả phần ngoài heap. Container có thể bị giết khi heap vẫn còn trống.',
      },
    ],
  },
})
