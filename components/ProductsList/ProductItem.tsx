import Image from "next/image";
import {
    Box,
    Button,
    FormControl,
    Heading,
    HStack,
    Input,
    Link,
    Select,
    Stack,
    Tag,
    Text,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";
import {ExternalLinkIcon} from "@chakra-ui/icons";
import {FC, useEffect} from "react";
import {ApiClient} from "../api";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Platform, Product, VariantTitle, VariantType} from "../../domain/products";
import {getVariantQrConfig} from "../../utils/products";

interface ProductItemProps {
    product: Product;
}

type ProductFormInputs = {
    variant: VariantTitle;
    redirectUrl: string;
}

const changeableSchemas = [
    {
        platform: Platform.youtube,
        matches: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/.+$)?/,
        message: 'Only YouTube links are allowed',
    },
    {
        platform: Platform.tiktok,
        matches: /^(https?:\/\/)?(www\.)?(tiktok\.com)(\/.+$)?/,
        message: 'Only TikTok links are allowed',
    },
    {
        platform: Platform.spotify,
        matches: /^(https?:\/\/)?(www\.)?(spotify\.com)(\/.+$)?/,
        message: 'Only Spotify links are allowed',
    }
];

const schema = yup.object().shape({
    name: yup.string().max(50).notRequired(),
    redirectUrl: yup.string().url("The text must be a valid link. Remember to include the “https://”").max(500),
});


export const ProductItem: FC<ProductItemProps> = ({product}) => {
    const {title, imageUrl, linkUrl, codeId, variant} = product;

    const toast = useToast();
    const borderColor = useColorModeValue('gray.300', 'gray.700');

    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: {errors, isSubmitting, isDirty}
    } = useForm<ProductFormInputs>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            variant,
            redirectUrl: linkUrl
        }
    })

    useEffect(() => {
        setValue('variant', variant);
        setValue('redirectUrl', linkUrl);
    }, [variant, linkUrl]);


    console.log({variant})

    const handleSaveItem = async ({redirectUrl, variant}: ProductFormInputs) => {
        try {
            const apiClient = new ApiClient();
            const {item} = await apiClient.updateItem({codeId, variant, linkUrl: redirectUrl.trim()});

            toast({
                title: "Item updated",
                status: "success",
                duration: 2000,
                position: "top",
            });

            reset({
                variant: item.variant,
                redirectUrl: item.linkUrl
            });

        } catch (e) {
            console.log(e);
            toast({
                title: "Error while updating item",
                status: "error",
                duration: 2000,
                position: "top",
            });
        }
    };

    const qrConfig = getVariantQrConfig(variant);

    return (
        <Box
            marginTop={{base: '1', sm: '5'}}
            marginBottom={{base: '1', sm: '5'}}
            display="flex"
            flexDirection={{base: 'column', sm: 'row'}}
            justifyContent="space-between">
            <Box
                display="flex"
                flex="1"
                marginRight="3"
                position="relative"
                alignItems="center">
                <Box
                    width={{base: '100%', sm: '85%'}}
                    zIndex="2"
                    marginLeft={{base: '0', sm: '5%'}}
                    marginTop="5%">
                    <Image
                        src={imageUrl}
                        alt="some good alt text"
                        width={400}
                        height={400}
                    />
                </Box>
                <Box zIndex="1" width="100%" position="absolute" height="100%">
                    <Box
                        bgGradient={useColorModeValue(
                            'radial(orange.600 1px, transparent 1px)',
                            'radial(orange.300 1px, transparent 1px)'
                        )}
                        backgroundSize="20px 20px"
                        opacity="0.4"
                        height="100%"
                    />
                </Box>
            </Box>
            <Box display="flex" flex="1" flexDirection="column" justifyContent="center"
                 marginTop={{base: '3', sm: '0'}}>

                <Heading marginTop={{base: '1', sm: '5'}}
                         marginBottom={{base: '1', sm: '5'}}>
                    <Link textDecoration="none" _hover={{textDecoration: 'none', cursor: 'text'}}>
                        {title.split(' - ')[0]}
                    </Link>
                </Heading>

                <HStack spacing={2} marginY={{
                    base: '5',
                    sm: '3',
                    md: '4'
                }}>
                    <Tag size={'md'} variant="solid" colorScheme="orange" marginRight={'10px'}>
                        #{codeId}
                    </Tag>

                    <Link href={`https://qr.reshrd.com/${codeId}`} target={'_blank'} rel={'noreferrer'}
                          title={'Check it out'}>
                        <ExternalLinkIcon marginBottom={'6px'}/>
                    </Link>
                </HStack>

                <Box marginY={{
                    base: '0',
                    sm: '3',
                    md: '4'
                }}>
                    <form onSubmit={handleSubmit(handleSaveItem)}>
                        <Stack spacing={4} width={{sm: '300px', md: '400px'}}>
                            <FormControl>
                                <Select placeholder="Select variant" {...register('variant')} variant={'solid'} borderWidth={1}
                                    color={'gray.200'} _placeholder={{color: 'gray.400',}} borderColor={borderColor}
                                    required aria-label={'Name the product'} marginBottom={{base: '5', sm: '3', md: '4'}}>
                                    {
                                        Object.values(VariantTitle).map((variant) => (
                                            <option key={variant} value={variant}>{variant}</option>
                                        ))
                                    }

                                </Select>
                                <Text color={'red.400'}>
                                    {errors.variant && errors.variant.message}
                                </Text>
                            </FormControl>

                            <FormControl>
                                {
                                    qrConfig.type === VariantType.CHANGEABLE && <Input
                                        {...register('redirectUrl')}
                                        variant={'solid'}
                                        borderWidth={1}
                                        color={'gray.200'}
                                        _placeholder={{
                                            color: 'gray.400',
                                        }}
                                        borderColor={borderColor}
                                        type={'text'}
                                        required
                                        placeholder={'e.g. https://google.com'}
                                        aria-label={'Redirect link'}
                                        marginBottom={{
                                            base: '5',
                                            sm: '3',
                                            md: '4'
                                        }}
                                    />

                                }
                                <Text color={'red.400'}>
                                    {errors.redirectUrl && errors.redirectUrl.message}
                                </Text>
                            </FormControl>


                            <Button
                                type={'submit'} px={4} marginLeft={'1%'} fontSize={'sm'} rounded={'full'}
                                bg={'green.400'} color={'white'}
                                minWidth={'127px'} _hover={{bg: 'green.500'}}
                                _focus={{bg: 'green.500',}}
                                isLoading={isSubmitting}
                                disabled={!isDirty}
                            >
                                Save
                            </Button>


                            <Box display={{base: 'block', sm: 'none'}}>
                                <hr style={{margin: '15px 0'}}/>
                            </Box>
                        </Stack>

                    </form>
                </Box>
            </Box>
        </Box>
    );
}
