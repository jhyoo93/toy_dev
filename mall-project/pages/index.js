import Link from 'next/link'
import styles from '@/styles/Home.module.css'

export default function Home() {
    return (
    <>
        <h1>dev-mall</h1>
        <ul>
            <li>
                <Link href="/products/1">첫 번째 상품</Link>
            </li>
            <li>
                <Link href="/products/2">두 번째 상품</Link>
            </li>
            <li>
                <Link href="/products/3">세 번째 상품</Link>
            </li>
        </ul>
    </>    
    )
}