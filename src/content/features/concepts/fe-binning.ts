import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-binning',
  summary:
    'Binning chia biến số thành các khoảng, giúp mô hình tuyến tính bắt được quan hệ phi tuyến và giới hạn ảnh hưởng của ngoại lai. Đổi lại, biến mất thông tin trong từng khoảng.',
  tags: ['Biến đổi', 'Chia nhóm', 'Credit Scoring'],
  related: ['fe-woe', 'fe-iv', 'fe-one-hot', 'eda-outliers', 'eda-distribution'],
  sections: {
    definition: `**Binning (Chia khoảng giá trị)** biến một biến số liên tục thành các nhóm rời rạc, ví dụ tuổi thành \`dưới 25\`, \`25 đến 40\`, \`trên 40\`. Mỗi nhóm sau đó được mã hóa bằng [[fe-one-hot]] hoặc [[fe-woe]].`,

    origin: `Mô hình tuyến tính chỉ có một hệ số cho biến số, nên không biểu diễn được quan hệ hình chữ U. Binning cho mỗi khoảng một mức riêng.`,

    whyUse: `- **Mô hình tuyến tính bắt được quan hệ phi tuyến.**
- **Ngoại lai bị giới hạn** vì rơi vào nhóm ở biên.
- **Giá trị thiếu có thể thành một nhóm riêng.**`,

    mechanism: `**Các cách chia:**

- **Equal-width (Cùng độ rộng):** dễ hiểu, nhưng ngoại lai làm phần lớn dòng dồn vào một nhóm.
- **Equal-frequency (Cùng số dòng):** bền với ngoại lai, nhưng độ rộng không đều, và giá trị trùng nhiều làm khó chia.
- **Theo nhãn:** dùng cây hoặc tối ưu để chọn ranh giới. Mạnh hơn, nhưng dùng nhãn nên dễ rò rỉ.

\`KBinsDiscretizer\` của scikit-learn có \`strategy\` gồm \`uniform\`, \`quantile\` (mặc định), \`kmeans\`, và mặc định chia 5 nhóm rồi One-Hot.

**Ranh giới chỉ học trên train.** Test và production dùng lại đúng các ranh giới đó.

**Đánh đổi:** hai người 39 và 41 tuổi bị xem là khác hẳn, còn 26 và 39 tuổi lại như nhau. Royston, Altman và Sauerbrei (2006) cảnh báo đặc biệt về việc chia đôi biến liên tục, vì mất nhiều thông tin.`,

    example: `Thu nhập từ 5 đến 2.000 triệu, chia 5 nhóm cùng độ rộng thì mỗi nhóm rộng 399 triệu, nên 99% khách hàng rơi vào nhóm đầu và biến gần như vô dụng. Chia cùng số dòng thì mỗi nhóm có 20% khách hàng.`,

    prosCons: {
      pros: ['Bắt quan hệ phi tuyến trong mô hình đơn giản.', 'Bền với ngoại lai và dễ giải thích.'],
      cons: ['Mất thông tin trong từng nhóm.', 'Có bước nhảy không thực tế ở ranh giới.'],
    },

    whenToUse: {
      use: ['Mô hình tuyến tính cần bắt quan hệ phi tuyến, như thẻ điểm.'],
      avoid: ['Mô hình cây, vốn đã tự tìm ngưỡng.', 'Chia đôi biến liên tục chỉ để báo cáo cho gọn.'],
    },

    comparison: {
      headers: ['Cách chia', 'Với ngoại lai', 'Dùng nhãn'],
      rows: [
        ['Equal-width', 'Nhạy', 'Không'],
        ['Equal-frequency', 'Bền', 'Không'],
        ['Theo nhãn', 'Bền', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'Chia càng nhiều nhóm càng tốt.',
        truth: 'Nhóm nhỏ làm ước lượng không ổn định. IV có thể tăng, nhưng phần tăng có thể chỉ là nhiễu.',
      },
      {
        myth: 'Binning luôn cải thiện mô hình.',
        truth: 'Binning làm mất thông tin, nên chỉ có lợi khi mô hình không tự bắt được quan hệ phi tuyến.',
      },
    ],
  },
})
