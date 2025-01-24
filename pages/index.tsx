import {ProtectedRoute} from "../components/ProtectedRoute/ProtectedRoute";
import {useQuery} from "react-query";
import {useAuth} from "../context/AuthContext";
import {ApiClient} from "../components/api";
import {ProductList} from "../components/ProductsList/ProductList";
import {Container, Link, Spinner, Text} from "@chakra-ui/react";
import Head from "next/head";
import {GetServerSideProps} from "next";
import nookies from "nookies";
import {ProductSource} from "../domain/products";


export default function Index(props: any) {
    const {getCurrentUserToken} = useAuth();


    async function getItemsQuery() {
        const apiClient = new ApiClient();
        return await apiClient.getItems({source: ProductSource.MOXIE});
    }

    const {data, isLoading, isError} = useQuery('items', getItemsQuery, {
        enabled: !!getCurrentUserToken,
        refetchOnWindowFocus: false,
    });

    return (
        <ProtectedRoute token={props?.cookies.token}>
            <Head>
                <title>Your items - Updateable QR Clothing Control Panel | MOXIE</title>
                <meta name="robots" content="index"/>
            </Head>
            <div>
                <Container minH={'88vh'} maxW={'7xl'} p="12">

                    {isLoading && <Spinner size={'xl'}/>}

                    {isError && <p>Error</p>}

                    {data && <ProductList products={data.items}/>}

                    {
                        data && data.items.length === 0 && <Text marginTop={12}>
                            You don’t have any items yet — <Link href={'https://moxieimpact.com/'}
                                                                 target={'_blank'}
                                                                 rel={'noopener noreferrer'}
                                                                 color={
                                                                     'blue.500'
                                                                 }> head to our store </Link> to get some!
                        </Text>
                    }

                </Container>
            </div>
        </ProtectedRoute>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookies = nookies.get(ctx)

    return {
        props: {
            server: true,
            cookies,
        },
    }
}