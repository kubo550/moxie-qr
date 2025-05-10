import Image from "next/image";
import {
    Box,
    Button, Checkbox,
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
import {Product, VariantTitle, VariantType} from "../../domain/products";
import {dailyMoxieUrl, getVariantQrConfig} from "../../utils/products";

interface ProductItemProps {
    product: Product;
}

type ProductFormInputs = {
    variant: VariantTitle;
    useCustomLink: boolean;
    redirectUrl: string;
}

const schema = yup.object().shape({
    name: yup.string().max(50).notRequired(),
    redirectUrl: yup
        .string()
        .when('variant', (variant, schema) => {
            switch (variant) {
                case VariantTitle.youtube:
                    return schema
                        .url("The text must be a valid link. Remember to include the “https://”")
                        .matches(
                            /^(https:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w\-]{11}(\?.*)?$/,
                            'Link must be a valid YouTube URL.'
                        )
                        .max(500);
                case VariantTitle.tiktok:
                    return schema
                        .url("The text must be a valid link. Remember to include the “https://”")
                        .matches(
                            /^(https:\/\/(www\.)?tiktok\.com\/.*|https:\/\/my\.moxieimpact\.com\/.*)$/,
                            'Link must be a valid TikTok URL.'
                        )
                        .max(500);
                case VariantTitle.spotify:
                    return schema
                        .url("The text must be a valid link. Remember to include the “https://”")
                        .matches(
                            /^(https:\/\/(www\.)?spotify\.com\/.*|https:\/\/my\.moxieimpact\.com\/.*)$/,
                            'Link must be a valid Spotify URL.'
                        )
                        .max(500);
                case VariantTitle.instagram:
                    return schema
                        .url("The text must be a valid link. Remember to include the “https://”")
                        .matches(
                            /^(https:\/\/(www\.)?instagram\.com\/.*|https:\/\/my\.moxieimpact\.com\/.*)$/,
                            'Link must be a valid Spotify URL.'
                        )
                        .max(500);
                case VariantTitle.youtube:
                    return schema
                        .url("The text must be a valid link. Remember to include the “https://”")
                        .matches(
                            /^(https:\/\/(www\.)?youtube\.com\/.*|https:\/\/my\.moxieimpact\.com\/.*)$/,
                            'Link must be a valid Spotify URL.'
                        )
                        .max(500);
                default:
                    return schema
                        .url("The text must be a valid link. Remember to include the “https://”")
                        .max(500);
            }
        }),
});


export const ProductItem: FC<ProductItemProps> = ({product}) => {
    const {title, imageUrl, linkUrl, codeId, variant} = product;

    const toast = useToast();
    const borderColor = useColorModeValue('gray.300', 'gray.700');

    const {
        handleSubmit,
        register,
        reset,
        watch,
        setValue,
        formState: {errors, isSubmitting, isDirty}
    } = useForm<ProductFormInputs>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            variant,
            useCustomLink: !linkUrl.startsWith(dailyMoxieUrl),
            redirectUrl: linkUrl
        }
    })

    const currentVariant = watch('variant');
    const currentUseOriginalLink = watch('useCustomLink');
    const qrConfig = getVariantQrConfig(currentVariant);



    useEffect(() => {
        if (!currentUseOriginalLink) {
            setValue('redirectUrl', qrConfig.options.base);
        }
    }, [currentUseOriginalLink]);

    useEffect(() => {
        if (currentVariant) {
            const config = getVariantQrConfig(currentVariant);
            setValue('redirectUrl', config.options.base);
        }
    }, [currentVariant]);

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
                redirectUrl: item.linkUrl,
                useCustomLink: !item.linkUrl.startsWith(dailyMoxieUrl)
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
                    width={{ base: '100%', sm: '85%' }}
                    zIndex="2"
                    ml={{ base: '0', sm: '5%' }}
                    mt="5%"
                    borderRadius="6px"
                    overflow="hidden"
                    position="relative"
                    _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bg: 'blackAlpha.300',
                        zIndex: 1,
                    }}
                >
                    <Image
                        src={imageUrl}
                        alt="some good alt text"
                        width={400}
                        height={400}
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            mixBlendMode: 'multiply',
                            width: '100%',
                            height: 'auto',
                        }}
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
                                <Select {...register('variant')} variant={'solid'} borderWidth={1}
                                        color={'gray.200'} _placeholder={{color: 'gray.400',}} borderColor={borderColor}
                                        required aria-label={'Name the product'}
                                        marginBottom={{base: '5', sm: '3', md: '4'}}
                                >
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


                            {qrConfig.type === VariantType.CHANGEABLE && (
                                <FormControl>
                                         <Input
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
                                            placeholder={`https://www.${qrConfig.options.platforms?.[0] || 'youtube'}.com/123`}
                                            aria-label={'Redirect link'}
                                            marginBottom={{
                                                base: '5',
                                                sm: '3',
                                                md: '4'
                                            }}
                                        />
                                    <Text color={'red.400'}>
                                        {errors.redirectUrl && errors.redirectUrl.message}
                                    </Text>
                                </FormControl>
                            )}



                            <Button
                                type={'submit'} px={4} marginLeft={'1%'} fontSize={'sm'} rounded={'full'}
                                bg={'orange.300'} color={'white'}
                                minWidth={'127px'} _hover={{bg: 'orange.400',}}
                                _focus={{bg: 'orange.400',}}
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
