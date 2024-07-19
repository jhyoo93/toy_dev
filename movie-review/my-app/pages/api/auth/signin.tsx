import { getProviders, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';

export default function SignIn({ providers }: any) {
  return (
    <>
      <div>
        {providers ? (
          Object.values(providers).map((provider: any) => (
            <div key={provider.name}>
              <button onClick={() => signIn(provider.id)}>
                {provider.name}로 로그인
              </button>
            </div>
          ))
        ) : (
          <p>로그인 제공자를 불러오는 중 오류가 발생했습니다.</p>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
