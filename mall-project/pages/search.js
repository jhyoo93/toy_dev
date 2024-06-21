import { useRouter } from "next/router";

export default function Search() {
    const router = useRouter();
    const {q} = router.query;

    return( 
        <div>
            <h1>Search 페이지</h1>
            <h2>{q} 검색결과</h2>
        </div>

    );
}