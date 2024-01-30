// import { getTokenFromUrl } from "./AuthUtils";

// describe("test get token from url", () => {
//   const expected_output = {
//     "token_type":"Bearer",
//     "expires_in": 3600,
//     "id_token": 
//   };
//   const test_url =
//     "http://localhost:3000/#id_token=eyJraWQiOiJpNnFEeTU2c0ZRVFdWeUR6VXVLYitGZjlZc1hTaFRqXC9EbjZnRndIcDYzcz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiM1pFS3FzUVd2QnE4TGc5R3pDQUs4QSIsInN1YiI6ImViOTJlNThmLTFhYWUtNDNkYS1iMmZmLTY2YTY0MDVhMDc2MyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfUmRJMUh2S3h6IiwiY29nbml0bzp1c2VybmFtZSI6ImViOTJlNThmLTFhYWUtNDNkYS1iMmZmLTY2YTY0MDVhMDc2MyIsImF1ZCI6IjU3MmFvY2dnZWdjM2drYmV1YmE3bXIxNnF2IiwiZXZlbnRfaWQiOiIzMzJjMzhkYS1iMTFhLTQ1NzctYjVkZS1mMTNlOGM4YTc1MmIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcwNDQxNDM0NSwiZXhwIjoxNzA0NDE3OTQ1LCJpYXQiOjE3MDQ0MTQzNDUsImp0aSI6IjA1MDcwZTAwLWZlYWItNGYwYS05Njc5LTRmMjExNDhmNzUyZCIsImVtYWlsIjoiZHp1bmcubGVhbmgyMThAZ21haWwuY29tIn0.cSzt-WPoi_nHn2uKkntnDNoEs0Jqicru2eSNhC-UnzyyvzjduryA8VqHp2gLvqqcO_nmI1hztFEFzkBoEt4ZNajpxPZqwQ84Jz9LNeNizzf1yDXukZ_wCYfGLuYw3fcMz6jtQ1XJ750jxFs6Zi09fEhIkcRG3kIHvXpf41Iwkuk3_xjDLx4qwr2Bhy_JxxVvPss-ZYUTN_yZ8HJUCXQfNztknLY9P6PiXDJHFPCudkKCqCIs2ImamN1dKvGk9VTxlUt5qiyfwdMzCt70QkCdIAi0KRL6_5VIagpqmbuzlCL5CzLV-EKA4vwnnPw4Wg6qOo0JQ5OSqfEmB45dJmKBkA&access_token=eyJraWQiOiJmdWRRbCtGYXdJdHE3VEoxVVBwXC91ejBDeTY2QkIxY1dFR1hWRVJcL0c3aGM9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJlYjkyZTU4Zi0xYWFlLTQzZGEtYjJmZi02NmE2NDA1YTA3NjMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfUmRJMUh2S3h6IiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiNTcyYW9jZ2dlZ2MzZ2tiZXViYTdtcjE2cXYiLCJldmVudF9pZCI6IjMzMmMzOGRhLWIxMWEtNDU3Ny1iNWRlLWYxM2U4YzhhNzUyYiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoicGhvbmUgb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE3MDQ0MTQzNDUsImV4cCI6MTcwNDQxNzk0NSwiaWF0IjoxNzA0NDE0MzQ1LCJqdGkiOiIwOTE5ZjExZS1iOTgxLTRhOTUtODA2NS0xMWZlNGZjZDdkNDAiLCJ1c2VybmFtZSI6ImViOTJlNThmLTFhYWUtNDNkYS1iMmZmLTY2YTY0MDVhMDc2MyJ9.ZWmQ38yQeR9GBKECF9YQQIAt52mz2Aa9rpdF7u9sFtrBY_G9EVMmTfIFRAn7Q3dtO7cBPwjwtX29PIfDcQ7cB67HTpWGGLYa7IByzmASIj4NsQxpcLrz0yVFVhdqc6nHt_h14zxMu3mGjgdkTaQbyYNVFGNASgalQNkmgxQsJo_XCJVsfbluB1l_fLJ8sf_AuPiubW5NkwNwuiDkmRpr3DoW6EqMewMdfrMJ9kQoTcIkQ-IhoKAy0Irz5hXis7HTCPDVaOcaCcdfbOLOOAk0gPh6HdSn43dK9rShcEUUKDfK9KIoLjHCOUGYA6VJ-ebcwcywq_y1szcmU48sSYbkhw&expires_in=3600&token_type=Bearer";
//   it("should return token from url", () => {
//     // convert test_url to location.search string
//     const parsed_url = new URL(test_url);
//     const output_token = getTokenFromUrl(parsed_url.search);
//     expect(output_token).toEqual({});
//   });
// });
