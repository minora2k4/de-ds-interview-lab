import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-ec2',
  summary:
    'EC2 cho thuê máy chủ ảo theo nhu cầu. Spot rẻ nhất nhưng có thể bị thu hồi với cảnh báo khoảng 2 phút, nên hợp với việc chịu được gián đoạn như Spark executor.',
  tags: ['AWS', 'Compute', 'Spot'],
  related: ['cloud-scaling', 'cloud-fault-tolerance', 'cloud-load-balancing', 'cloud-s3', 'spark-executor', 'hadoop-data-locality'],
  sections: {
    definition: `**Amazon EC2 (Elastic Compute Cloud, Dịch vụ máy chủ ảo)** cho thuê máy ảo, gọi là **instance**, với nhiều họ tối ưu cho CPU, bộ nhớ hoặc đĩa. Người dùng tự quản lý hệ điều hành và phần mềm.`,

    origin: `Trước đây, thêm máy chủ phải mua trước và chờ nhiều tuần, nên năng lực thường dư hoặc thiếu. EC2 cho phép thuê trong vài phút và trả lại khi hết việc. Spot ra đời để bán phần năng lực nhàn rỗi với giá thấp, đổi lại AWS có thể lấy lại.`,

    whyUse: `Cụm xử lý dữ liệu theo lô có thể chạy rồi tắt. Với Spot, việc tính toán chịu lỗi tốt như Spark có chi phí giảm rất nhiều so với On-Demand.`,

    mechanism: `**Spot bị thu hồi khi EC2 cần lại năng lực.** Máy nhận **cảnh báo 2 phút** rồi bị terminate, stop hoặc hibernate. Cảnh báo không được bảo đảm: AWS nói máy có thể bị thu hồi trước khi kịp báo. **Rebalance recommendation** là tín hiệu sớm hơn khi rủi ro tăng cao.

**Khuyến nghị của AWS:** dùng chiến lược \`price-capacity-optimized\`, linh hoạt trên ít nhất 10 loại máy và mọi AZ, vì càng đa dạng càng khó bị thu hồi cùng lúc.

**Lưu trữ:** Instance Store là đĩa gắn liền với máy, nhanh nhưng mất dữ liệu khi stop, hibernate hoặc terminate. EBS là đĩa mạng và tồn tại độc lập với máy.`,

    example: `Cụm Spark 100 máy cho job đêm: Driver và 20 máy chạy On-Demand, 80 máy Spot trên 12 loại máy, kết quả ghi lên [[cloud-s3|S3]]. Có đêm mất 6 máy Spot, Spark chạy lại các Task bị ảnh hưởng, nên job chậm thêm 8% nhưng tổng chi phí giảm hơn một nửa.`,

    prosCons: {
      pros: ['Toàn quyền cấu hình, chạy được mọi phần mềm.', 'Co giãn và trả theo mức dùng.'],
      cons: ['Phải tự vá lỗi và vận hành.', 'Spot không đảm bảo có máy, và không đảm bảo giữ máy đến khi xong.'],
    },

    whenToUse: {
      use: ['Spot: Spark executor, worker không giữ trạng thái, job chạy lại được.'],
      avoid: ['Không đặt Driver, NameNode hay cơ sở dữ liệu trên Spot, vì chúng giữ trạng thái khó phục hồi.'],
    },

    comparison: {
      headers: ['Cách mua', 'Cam kết', 'Bị thu hồi', 'Hợp với'],
      rows: [
        ['On-Demand', 'Không', 'Không', 'Tải khó đoán'],
        ['Savings Plans', '1 hoặc 3 năm, theo mức chi', 'Không', 'Tải nền ổn định'],
        ['Reserved Instances', '1 hoặc 3 năm, theo cấu hình', 'Không', 'Tải nền cố định'],
        ['Spot', 'Không', 'Có', 'Việc chịu được gián đoạn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Luôn có đủ 2 phút để dọn dẹp.',
        truth: 'Cảnh báo không được bảo đảm, nên phải lưu tiến độ thường xuyên ra ngoài máy.',
      },
      {
        myth: 'Đặt giá tối đa thấp sẽ tiết kiệm hơn.',
        truth: 'Theo tài liệu AWS, đặt giá tối đa làm máy bị gián đoạn thường xuyên hơn.',
      },
    ],
  },
})
