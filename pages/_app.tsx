import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Footer} from "../components/Footer/Footer";
import {Header} from "../components/Header/Header";
import {AuthContextProvider} from "../context/AuthContext";
import {QueryClient, QueryClientProvider} from "react-query";
import {useEffect, useState} from "react";
import {ChakraProvider, Flex} from "@chakra-ui/react";
import {extendTheme} from '@chakra-ui/react'
import {useRouter} from "next/router";
import Script from "next/script";
import Head from "next/head";

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    styles: {
        global: {
            body: {
                bg: "#f0f0f0",
                color: "white"
            }
        }
    },
    colors: {
        brand: {
            100: '#00264c',
            200: '#57b0e3',
            300: '#ffffff',
            400: '#000000',
            500: '#98d7fc',
            600: '#f9fbff',
        },
    },
}

const theme = extendTheme({config})

export default function App({Component, pageProps}: AppProps) {
    const [queryClient] = useState(() => new QueryClient());

    const router = useRouter()

    useEffect(() => {
        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((ReactPixel) => {
                ReactPixel.init('9006653022692930')
                ReactPixel.pageView()

                router.events.on('routeChangeComplete', () => {
                    ReactPixel.pageView()
                })
            })
    }, [router.events])

    return (<>
            <Head>
                <title>Updateable QR Clothing Control Panel | MOXIE</title>
                <meta name="description" content="Changeable QR code clothing management platform | Update your clothes any time you want | Explore limitless possibilities of the MOXIE streetwear and casualwear collections."/>
                <link rel="icon" href="/favicon.ico"/>
                <meta name={'robots'} content={'noindex, nofollow'}/>
            </Head>
            <QueryClientProvider client={queryClient}>
                <AuthContextProvider>
                    <ChakraProvider theme={theme} cssVarsRoot="body">
                        <Flex
                            flexDirection={'column'}
                            justifyContent={'space-between'}
                            flex={'1'}
                            minH={'100vh'}
                            margin={0}
                        >
                            <Header/>
                            <Component {...pageProps} />
                            <Footer/>
                        </Flex>
                    </ChakraProvider>
                </AuthContextProvider>
            </QueryClientProvider>
        </>
    )
}
