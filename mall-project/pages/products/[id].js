import { useRouter } from "next/router";

export default function Product() {
    const router = useRouter();
    const {id} = router.query;

    return <div>Product {id} 페이지</div>;
}
