import { useRouter } from "next/router";
import Head from 'next/head'

const Dynamic = () => {
    const router = useRouter();
    const query = router.query.dynamic;
    console.log ("query", query);
    return (
        <>
        <Head><title>{query}</title></Head>
        <main>
            <h1>Hi there, I'm a dynamic route: {query}</h1>
        </main>
        </>
    );
};

export default Dynamic;