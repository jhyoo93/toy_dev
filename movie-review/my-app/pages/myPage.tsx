import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

const MyPage = () => {

    const {user, clearUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push('/login');
        }
    }), [user, router];

    if(!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
          <h1>My Page</h1>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <button onClick={clearUser}>Logout</button>
        </div>
    );
};

export default MyPage;