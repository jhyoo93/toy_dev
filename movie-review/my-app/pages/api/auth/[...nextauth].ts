import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
    // 다른 제공자 설정 추가 가능
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // 에러 페이지
    verifyRequest: '/auth/verify-request', // 이메일 확인 페이지
    ///newUser: null // 신규 사용자에게 보이는 페이지 (옵션)
  },
});