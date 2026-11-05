# DE/DS Interview Lab

Website tiếng Việt để tự học lý thuyết và luyện phỏng vấn Data Engineer, Data Scientist. Ứng dụng tĩnh, không có backend, dữ liệu người dùng lưu trong LocalStorage của trình duyệt.

## Chạy trên máy

```bash
npm install
npm run dev
```

Mở địa chỉ mà Vite in ra, có dạng `http://localhost:5173/de-ds-interview-lab/`.

Muốn thử bản build giống hệt khi deploy, và mở được trên điện thoại cùng mạng Wi-Fi:

```bash
npm run build
npm run preview -- --host
```

## Kiểm tra

```bash
npm run validate:content
npm test
npm run build
```

Khi đang viết một chủ đề, có thể chỉ yêu cầu đủ nội dung cho chủ đề đó:

```bash
npm run validate:content -- --topic spark
```

## Thêm nội dung

Danh mục các khái niệm nằm trong `src/content/catalog.ts`. Mỗi chủ đề là một thư mục trong `src/content`:

| Đường dẫn | Nội dung |
|---|---|
| `src/content/<topic>/concepts/<concept-id>.ts` | Một khái niệm, tên tệp trùng với ID |
| `src/content/<topic>/quiz/*.ts` | Câu hỏi quiz |
| `src/content/<topic>/interview/*.ts` | Câu hỏi phỏng vấn |

Tệp mới được nhận tự động, không cần khai báo thêm. Trong Markdown, dùng `[[concept-id]]` hoặc `[[concept-id|nhãn]]` để liên kết tới khái niệm khác.

## Tích hợp AI sau này

Việc chấm câu trả lời đi qua interface `AnswerEvaluator` trong `src/domain/interview/evaluator.ts`. Hiện tại `KeywordEvaluator` chấm theo từ khóa. Chỉ cần thêm một lớp gọi API cùng interface này là giao diện dùng được ngay.
