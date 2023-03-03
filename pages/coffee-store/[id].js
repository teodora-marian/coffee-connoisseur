import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from '../../storage/store-context'
import { isEmpty, fetcher } from "@/utils";

import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';

import useSWR from 'swr';



export async function getStaticProps(staticProps) {
    console.log("====>props", staticProps)
    const params = staticProps.params;
    console.log("params", params);
  
    const coffeeStores = await fetchCoffeeStores();
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id; //dynamic id
    });

    return {
      props: {
        coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    }
  };
};

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString(),
            }
        }
    });
    
    return {
        paths,
        fallback: true,
    }
};

const CoffeeStore = (initialProps) => {
    const router = useRouter();

    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});

    const { state: { coffeeStores } } = useContext(StoreContext);

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {id, name, address, locality, voting, imgUrl} = coffeeStore;
            const response = await fetch("/api/createCoffeeStore", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    id, 
                    name, 
                    address, 
                    locality, 
                    voting: 0, 
                    imgUrl,
                }),
            });

            const dbCoffeeStore = await response.json();
            console.log({dbCoffeeStore})

        } catch(err) {
            console.log("Error creating coffee store", err)
        }
    };

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
                    return coffeeStore.id.toString() === id; //dynamic id
                });

                if (findCoffeeStoreById){
                    setCoffeeStore(findCoffeeStoreById);
                    handleCreateCoffeeStore(findCoffeeStoreById); 
                }   
            }
        } else {
            //SSG
            handleCreateCoffeeStore(initialProps.coffeeStore);
        }
    }, [id, initialProps, initialProps.coffeeStore, coffeeStores]);

    const {
        name = "", 
        address = "", 
        locality = "", 
        imgUrl = "",
    } = coffeeStore;

    const [votingCount, setVotingCount] = useState (0);

    const {data, error} = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
        useEffect (() => {
            if (data && data.length > 0 ) {
                console.log("data from SWR", data);
                setCoffeeStore(data[0]);
                setVotingCount(data[0].voting);
        }
    }, [data]);

    if (router.isFallback) {
        return <div>Loading...</div>;
    };    

    const handleUpvoteButton = async () => {
        console.log("handle upvote");

        try {
            const response = await fetch("/api/upvoteCoffeeStoreById", {
                method: "PUT",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ id, }),
            });

            const dbCoffeeStore = await response.json();
            console.log({dbCoffeeStore})
            if (dbCoffeeStore && dbCoffeeStore.length > 0) {
                let count = votingCount + 1;
                setVotingCount(count);
            };
        } catch(err) {
            console.log("Error upvoting coffee store", err)
        }
    };

    if (error) {
        return <div>Sth went wrong retrieving Coffee Store page</div>
    }

    return (
        <div className={styles.layout}>
            <Head><title>{name}</title></Head>
            <div className={styles.container}>
                <div className={styles.col1}> 
                    <div className={styles.backToHomeLink}><Link href="/">← Back to home</Link></div>
                    <div className={styles.nameWrapper}><h1 className={styles.name}>{name}</h1></div>
                    <Image src={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} alt ={name} width="600" height="360" className={styles.storeImg}/>
                </div>
                <div className={cls("glass", styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/places.svg" width="24" height="24" alt="address pin"/>
                        <p className={styles.text}>{address}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/nearMe.svg" width="24" height="24"alt="location arrow"/>
                        <p className={styles.text}>{locality}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/star.svg" width="24" height="24" alt="upvote stars"/>
                        <p className={styles.text}>{votingCount}</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Upvote!</button>
                </div>
            </div>
        </div>
    );
};

export default CoffeeStore;