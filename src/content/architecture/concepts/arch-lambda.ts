import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-lambda',
  summary:
    'Lambda Architecture do Nathan Marz đề xuất: Batch Layer tính lại toàn bộ dữ liệu bất biến để có kết quả đúng, Speed Layer bù phần dữ liệu mới, và truy vấn gộp cả hai. Cái giá là phải giữ cùng một logic trên hai hệ thống.',
  tags: ['Kiến trúc', 'Batch', 'Streaming', 'First Principles'],
  related: ['arch-kappa', 'arch-batch', 'arch-streaming', 'etl-batch', 'etl-stream', 'hadoop-mapreduce', 'cloud-cap', 'arch-reliability'],
  sections: {
    definition: `**Lambda Architecture (Kiến trúc Lambda)** xử lý cùng một dòng dữ liệu qua hai nhánh song song. **Batch Layer (Lớp lô)** định kỳ tính lại kết quả từ toàn bộ dữ liệu gốc. **Speed Layer (Lớp tốc độ)** tính gia tăng trên phần dữ liệu mới mà batch chưa kịp xử lý. **Serving Layer (Lớp phục vụ)** cung cấp kết quả của batch, và truy vấn gộp kết quả của cả hai nhánh.

Ý tưởng gốc nằm trong một công thức: \`query = function(all data)\`. Mọi kết quả đều là một hàm trên toàn bộ dữ liệu, còn Speed Layer chỉ bù độ trễ của phép tính đó.`,

    origin: `Nathan Marz, tác giả Apache Storm, mô tả kiến trúc này trong bài blog "How to beat the CAP theorem" (tháng 10/2011). Bài viết gọi nó là kiến trúc batch/realtime. Tên Lambda Architecture được dùng sau đó, và được trình bày đầy đủ trong sách *Big Data* của Marz và James Warren (Manning, 2015).

Lúc đó, [[hadoop-mapreduce|MapReduce]] tính đúng và dễ tính lại, nhưng trễ hàng giờ. Storm cho kết quả trong vài giây, nhưng phải cập nhật trạng thái trong cơ sở dữ liệu đọc ghi, nên một lỗi code có thể làm hỏng dữ liệu mà không khôi phục được. Marz cho rằng nguồn gốc của độ phức tạp là **trạng thái thay đổi được cộng với thuật toán gia tăng**, nên ông cô lập phần đó vào một lớp tạm thời.

Tên bài dễ gây hiểu nhầm: Marz nói rõ không ai tránh được [[cloud-cap|CAP]], "beat" chỉ là cô lập độ phức tạp mà CAP thường gây ra.`,

    whyUse: `- **Vừa nhanh vừa đúng:** người dùng thấy số mới sau vài giây, và số đó được thay bằng kết quả chính xác sau vài giờ.
- **Chịu được lỗi của con người:** code sai thì sửa rồi tính lại từ dữ liệu gốc, vì dữ liệu gốc không bị ghi đè.`,

    mechanism: `1. **Ghi vào master dataset:** mọi sự kiện được lưu dạng append-only, bất biến, có thời gian. Vì không ai sửa dòng cũ, code lỗi không thể phá hỏng dữ liệu gốc.
2. **Batch Layer tính lại toàn bộ:** mỗi chu kỳ chạy một hàm trên toàn bộ dữ liệu, tạo ra batch view mới. Không cần thuật toán gia tăng nên logic đơn giản hơn nhiều, đổi lại là độ trễ hàng giờ.
3. **Serving Layer phục vụ batch view:** kho chỉ cần ghi theo lô và đọc ngẫu nhiên, nên rất đơn giản, ví dụ ElephantDB.
4. **Speed Layer bù phần còn thiếu:** chỉ xử lý dữ liệu sau mốc cắt của batch view gần nhất, và ghi vào kho đọc ghi như Cassandra.
5. **Truy vấn gộp hai view:** phép cộng thì dễ gộp, còn đếm giá trị khác nhau cần cấu trúc như HyperLogLog.
6. **Batch mới ghi đè sai sót cũ:** khi batch view mới xong, phần realtime view tương ứng bị bỏ. Vì vậy sai sót của Speed Layer chỉ là tạm thời.

Điểm dễ sai nhất là **mốc cắt**: phải biết chính xác batch view đã tính đến đâu. Sai mốc này thì kết quả gộp bị đếm trùng hoặc thiếu.`,

    diagram: {
      mermaid: `flowchart TD
  A["Nguồn sự kiện"] --> B["Master dataset bất biến"]
  A --> C["Speed Layer: tính gia tăng"]
  B --> D["Batch Layer: tính lại toàn bộ"]
  D --> E["Batch view: đúng nhưng trễ"]
  C --> F["Realtime view: mới nhưng tạm thời"]
  E --> G["Truy vấn gộp hai view"]
  F --> G`,
      caption:
        'Hai nhánh cùng nhận một dữ liệu. Batch view mới sẽ thay thế phần realtime view tương ứng, nên sai sót của Speed Layer không tồn tại lâu.',
    },

    example: `Một nền tảng video có 2 tỷ lượt xem mỗi ngày. Batch chạy lúc 2 giờ sáng, mất 3 giờ, tính lại doanh thu theo video và lọc bot bằng thuật toán nặng. Speed Layer đếm lượt xem từ mốc cắt với độ trễ 5 giây, và có thể lệch khoảng 0,5% do chưa lọc hết bot.

Người sáng tạo thấy con số tăng liên tục, còn tiền thanh toán chỉ lấy từ batch. Khi có lỗi lọc bot, đội dữ liệu sửa code rồi tính lại 30 ngày từ master dataset. Cái giá là 40 chỉ số đều được viết hai lần, và mỗi lần đổi định nghĩa phải sửa ở cả hai nơi.`,

    prosCons: {
      pros: [
        '**Có đường tự sửa lỗi:** batch ghi đè kết quả sai của Speed Layer mà không cần thao tác thủ công.',
        '**Cô lập độ phức tạp:** Speed Layer chỉ giữ vài giờ dữ liệu, nên hỏng thì có thể bỏ đi và khởi động lại.',
      ],
      cons: [
        '**Hai bộ code cho một logic:** hai nơi dễ lệch nhau, và mỗi thay đổi tốn gấp đôi công sức.',
        '**Hai hệ thống phải vận hành:** gỡ lỗi phải xem cả hai, và người dùng có thể thấy số nhảy khi batch ghi đè.',
        '**Tốn kém khi dữ liệu lớn:** tính lại toàn bộ mỗi chu kỳ ngày càng đắt.',
      ],
    },

    whenToUse: {
      use: [
        'Cần số tức thời, nhưng số chính thức phải qua logic nặng mà stream khó làm, như lọc bot trên toàn lịch sử.',
        'Engine stream hiện có chưa đủ tin cậy để làm nguồn sự thật cho các số liên quan đến tiền.',
      ],
      avoid: [
        'Báo cáo chấp nhận trễ vài giờ: chỉ cần [[arch-batch]].',
        'Engine stream đã đủ chính xác và phát lại được: cân nhắc [[arch-kappa]].',
      ],
    },

    comparison: {
      intro: 'So sánh Lambda với hai lựa chọn gần nhất:',
      headers: ['Tiêu chí', 'Lambda', 'Kappa', 'Chỉ batch'],
      rows: [
        ['Độ trễ', 'Giây đến phút ở Speed Layer', 'Giây đến phút', 'Phút đến giờ'],
        ['Cách tính lại', 'Chạy lại batch trên toàn bộ dữ liệu', 'Phát lại log bằng job mới', 'Chạy lại theo partition'],
        ['Chi phí lớn nhất', 'Duy trì hai bộ code', 'Lưu log lâu, vận hành state', 'Không có số tức thời'],
      ],
    },

    misconceptions: [
      {
        myth: 'Lambda đánh bại định lý CAP.',
        truth: 'CAP vẫn nguyên vẹn, chính Marz cũng nói vậy. Lambda chỉ cô lập độ phức tạp của trạng thái thay đổi vào một lớp tạm thời.',
      },
      {
        myth: 'Dùng framework viết một lần cho cả hai nhánh là hết nhược điểm.',
        truth: 'Cách như Summingbird giảm được phần code. Jay Kreps chỉ ra rằng gánh nặng vận hành và gỡ lỗi hai hệ thống vẫn còn nguyên.',
      },
    ],
  },
})
